import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { FinancialDocument } from '@/models/FinancialDocument';
import { Product } from '@/models/Product';
import { Booking } from '@/models/Booking';
import { Income } from '@/models/Income';
import { Expense } from '@/models/Expense';
import { PurchaseOrder } from '@/models/PurchaseOrder';
import { Payslip } from '@/models/Payslip';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const dateFromParam = searchParams.get('dateFrom');
    const dateToParam = searchParams.get('dateTo');

    // ช่วงที่เลือก: ไม่ใส่อะไรเลย = วันนี้, ใส่แค่ฝั่งเดียว = วันเดียว, ใส่ทั้งคู่ = ช่วง
    const dateFrom = dateFromParam || dateToParam || new Date().toISOString().slice(0, 10);
    const dateTo   = dateToParam   || dateFromParam || new Date().toISOString().slice(0, 10);
    const isRange  = dateFrom !== dateTo;

    // "now" ใช้คำนวณเดือนปัจจุบัน (การ์ดเดือนนี้ไม่ขึ้นกับช่วงที่เลือก ยึดท้ายช่วงเป็นจุดอ้างอิง)
    const now = new Date(dateTo);

    const rangeStart = new Date(dateFrom);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(dateTo);
    rangeEnd.setHours(23, 59, 59, 999);
    const rangeDays = Math.round((rangeEnd.getTime() - rangeStart.getTime()) / 86400000) + 1;

    const prevDayStart = new Date(rangeStart);
    prevDayStart.setDate(prevDayStart.getDate() - 1);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // ─── ยอดขายในช่วงที่เลือก (+ เมื่อเลือกวันเดียว เทียบกับวันก่อนหน้า) ───
    const [rangeDocs, prevDayDocs, monthDocs] = await Promise.all([
      FinancialDocument.find({
        type: 'invoice',
        issuedAt: { $gte: rangeStart, $lte: rangeEnd },
      }).lean(),
      isRange ? Promise.resolve([]) : FinancialDocument.find({
        type: 'invoice',
        issuedAt: { $gte: prevDayStart, $lt: rangeStart },
      }).lean(),
      FinancialDocument.find({
        type: 'invoice',
        issuedAt: { $gte: monthStart, $lt: nextMonthStart },
      }).lean(),
    ]);

    const rangeRevenue = rangeDocs.filter(d => d.status === 'paid').reduce((s, d) => s + d.grandTotal, 0);
    const rangeBills = rangeDocs.length;
    const prevDayRevenue = prevDayDocs.filter(d => d.status === 'paid').reduce((s, d) => s + d.grandTotal, 0);
    const prevDayBills = prevDayDocs.length;
    const monthRevenue = monthDocs.filter(d => d.status === 'paid').reduce((s, d) => s + d.grandTotal, 0);

    const [monthIncomes, monthExpenses, monthPO, monthPayslip] = await Promise.all([
      Income.aggregate([
        { $match: { incomeDate: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // ตัดหมวด PurchaseOrder ออก — ยอดจ่ายค่าจัดซื้อนับจาก PO (amountPaid) ด้านล่างแล้ว ไม่ให้ซ้ำ
      Expense.aggregate([
        { $match: { category: { $ne: 'PurchaseOrder' }, expenseDate: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // นับเฉพาะ PO ที่กดชำระแล้ว (ยอดจ่ายจริง ตามวันชำระ) — ยังไม่ชำระไม่ถือเป็นค่าใช้จ่าย
      PurchaseOrder.aggregate([
        { $match: { status: 'received', paymentStatus: { $in: ['partial', 'paid'] }, paymentDate: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
      ]),
      Payslip.aggregate([
        { $match: { status: 'paid', paidAt: { $gte: monthStart, $lt: nextMonthStart } } },
        { $group: { _id: null, total: { $sum: '$netPay' } } }
      ]),
    ]);
    const totalIncomeMonth = monthIncomes[0]?.total ?? 0;
    const totalExpenseMonth = (monthExpenses[0]?.total ?? 0) + (monthPO[0]?.total ?? 0) + (monthPayslip[0]?.total ?? 0);
    const profitMonth = totalIncomeMonth - totalExpenseMonth;

    // ─── เอกสารค้างชำระ: ใบเสร็จที่ยังไม่ชำระ + ใบแจ้งหนี้ที่ยังค้าง (หักยอดที่รับชำระแล้วผ่านใบรับชำระ) ───
    const today = new Date();
    const [unpaidInvoices, openBillingNotes, paymentSums] = await Promise.all([
      FinancialDocument.find({ type: 'invoice', status: 'unpaid' }, { grandTotal: 1, dueDate: 1 }).lean(),
      FinancialDocument.find({ type: 'billing_note', status: { $in: ['unpaid', 'partial'] } }, { grandTotal: 1, dueDate: 1 }).lean(),
      FinancialDocument.aggregate([
        { $match: { type: 'payment_note' } },
        { $group: { _id: '$relatedDocId', paid: { $sum: '$grandTotal' } } },
      ]),
    ]);
    const paidByDoc = new Map(paymentSums.map(p => [String(p._id), p.paid as number]));
    const isOverdue = (d: { dueDate?: Date | null }) => !!d.dueDate && new Date(d.dueDate) < today;
    const unpaidDocs = {
      count: unpaidInvoices.length + openBillingNotes.length,
      amount:
        unpaidInvoices.reduce((s, d) => s + d.grandTotal, 0) +
        openBillingNotes.reduce((s, d) => s + Math.max(0, d.grandTotal - (paidByDoc.get(String(d._id)) ?? 0)), 0),
      overdueCount: [...unpaidInvoices, ...openBillingNotes].filter(isOverdue).length,
    };

    // เทียบเปอร์เซ็นต์ได้เฉพาะตอนเลือกวันเดียว (เทียบกับวันก่อนหน้า) — ช่วงหลายวันเทียบกับช่วงก่อนหน้าไม่สมเหตุ จึงไม่แสดง
    const revenueTrend = !isRange && prevDayRevenue > 0
      ? (((rangeRevenue - prevDayRevenue) / prevDayRevenue) * 100).toFixed(1)
      : null;
    const billTrend = isRange ? null : rangeBills - prevDayBills;

    // ─── Low stock products ──────────────────────────────────────
    const lowStock = await Product.find({ stock: { $lt: 5 }, published: true })
      .sort({ stock: 1 })
      .limit(5)
      .lean();

    // ─── Pending bookings ────────────────────────────────────────
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const rangeBookings = await Booking.countDocuments({
      createdAt: { $gte: rangeStart, $lte: rangeEnd },
    });

    // ─── เอกสารที่เคลื่อนไหวล่าสุด (ทุกประเภท) — นับทั้งตอนออกเอกสารและตอนชำระ ───────────
    const recentDocs = await FinancialDocument.aggregate([
      { $addFields: { activityAt: { $max: ['$createdAt', { $ifNull: ['$paidAt', '$createdAt'] }] } } },
      { $sort: { activityAt: -1 } },
      { $limit: 8 },
      { $project: { docNumber: 1, type: 1, customerName: 1, grandTotal: 1, status: 1, activityAt: 1 } },
    ]);

    // ─── รายรับ-รายจ่าย 6 เดือนล่าสุด (นิยามเดียวกับการ์ดรายเดือน) ──────────────────
    const chartStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const byMonth = (field: string, sumField: string, extra: Record<string, unknown> = {}) => [
      { $match: { ...extra, [field]: { $gte: chartStart, $lt: nextMonthStart } } },
      { $group: { _id: { y: { $year: `$${field}` }, m: { $month: `$${field}` } }, total: { $sum: `$${sumField}` } } },
    ];
    const [incomeAgg, expenseAgg, poAgg, payslipAgg] = await Promise.all([
      Income.aggregate(byMonth('incomeDate', 'amount')),
      Expense.aggregate(byMonth('expenseDate', 'amount', { category: { $ne: 'PurchaseOrder' } })),
      PurchaseOrder.aggregate(byMonth('paymentDate', 'amountPaid', { status: 'received', paymentStatus: { $in: ['partial', 'paid'] } })),
      Payslip.aggregate(byMonth('paidAt', 'netPay', { status: 'paid' })),
    ]);
    const pick = (agg: { _id: { y: number; m: number }; total: number }[], y: number, m: number) =>
      agg.find(r => r._id.y === y && r._id.m === m)?.total ?? 0;
    const thMonths = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
    const chartData = [];
    for (let i = 5; i >= 0; i--) {
      const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const y = m.getFullYear(), mo = m.getMonth() + 1;
      const income = pick(incomeAgg, y, mo);
      const expense = pick(expenseAgg, y, mo) + pick(poAgg, y, mo) + pick(payslipAgg, y, mo);
      chartData.push({ month: thMonths[m.getMonth()], income, expense, profit: income - expense });
    }

    // ─── Category breakdown ───────────────────────────────────────
    const categoryData = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, stock: { $sum: '$stock' } } }
    ]);

    // ─── Top products by stock sold (approximate from invoices) ──
    const totalProducts = await Product.countDocuments({ published: true });
    const totalStock = await Product.aggregate([
      { $group: { _id: null, total: { $sum: '$stock' } } }
    ]);

    return NextResponse.json({
      summary: {
        isRange,
        rangeDays,
        rangeRevenue,
        rangeBills,
        revenueTrend,
        billTrend,
        monthRevenue,
        pendingBookings,
        rangeBookings,
        totalProducts,
        totalStock: totalStock[0]?.total ?? 0,
        totalIncomeMonth,
        totalExpenseMonth,
        profitMonth,
        unpaidDocs,
      },
      recentDocs: recentDocs.map(d => ({
        id: d._id.toString(),
        docNumber: d.docNumber,
        type: d.type,
        customerName: d.customerName,
        grandTotal: d.grandTotal,
        status: d.status,
        activityAt: d.activityAt,
      })),
      lowStock: lowStock.map(p => ({
        id: p._id.toString(),
        name: `${p.brand} ${p.model} ${p.size}`,
        stock: p.stock,
        category: p.category,
      })),
      chartData,
      categoryData: categoryData.map(c => ({
        name: c._id,
        count: c.count,
        stock: c.stock,
      })),
    });
  } catch (err) {
    console.error('[dashboard]', err);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
