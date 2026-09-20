// สร้างข้อมูลตัวอย่างสำหรับทดลองใช้ระบบ (ลูกค้า สินค้า เอกสารทุกชนิด รายรับ รายจ่าย)
//
//   node scripts/seed-sample-data.mjs           สร้าง (รันซ้ำได้ — ลบชุดตัวอย่างเดิมก่อนสร้างใหม่)
//   node scripts/seed-sample-data.mjs --remove  ลบข้อมูลตัวอย่างทั้งหมด
//
// ทุกรายการที่สร้างจะมีฟิลด์ isSample: true — ลบเฉพาะรายการเหล่านั้น ไม่แตะข้อมูลจริง
// วันที่ทั้งหมดคิดย้อนหลังจากวันที่รันสคริปต์ เพื่อให้กราฟ/ยอดรายเดือนมีข้อมูลเสมอ
// ตัวเลขเอกสารคำนวณแบบเดียวกับฟอร์ม (VAT แบบบวกเพิ่ม 7%) และลงรายรับ (Income) เหมือนตอนชำระจริง

import { MongoClient } from 'mongodb';

process.loadEnvFile(new URL('../.env.local', import.meta.url));

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ ไม่พบ MONGODB_URI ใน .env.local');
  process.exit(1);
}

const COLLECTIONS = ['customers', 'products', 'financialdocuments', 'incomes', 'expenses'];
const S = { isSample: true };
const NOTE = 'ข้อมูลตัวอย่าง';

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db();

async function removeSamples() {
  let total = 0;
  for (const name of COLLECTIONS) {
    const r = await db.collection(name).deleteMany({ isSample: true });
    total += r.deletedCount;
    if (r.deletedCount) console.log(`   ลบ ${name}: ${r.deletedCount}`);
  }
  return total;
}

if (process.argv.includes('--remove')) {
  const n = await removeSamples();
  console.log(n ? `\n✅ ลบข้อมูลตัวอย่างแล้ว ${n} รายการ` : 'ไม่พบข้อมูลตัวอย่างให้ลบ');
  await client.close();
  process.exit(0);
}

console.log('🧹 ลบชุดตัวอย่างเดิม (ถ้ามี)...');
await removeSamples();

// ── ช่วยคำนวณวันที่ / เงิน ────────────────────────────────────────────────
const today = new Date();
const daysAgo = (n, h = 10) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - n, h, 0, 0);
const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// ── สินค้า (ทองแดง / ท่อเหล็ก / วัสดุโลหะ / ข้อต่อ) ───────────────────────────
// key: [ชื่อ, ราคาขาย, ต้นทุน, สต๊อก, หมวด, สเปก]
const CATALOG = {
  cuPipe12:  ['ท่อทองแดง Type L 1/2" (5.8 ม.)', 1250, 980, 120, 'ทองแดง', 'Type L 1/2" ยาว 5.8 ม.'],
  cuPipe78:  ['ท่อทองแดง Type L 7/8" (5.8 ม.)', 3480, 2790, 64, 'ทองแดง', 'Type L 7/8" ยาว 5.8 ม.'],
  cuSheet:   ['แผ่นทองแดง 1.0x1000x2000 มม.', 9800, 8100, 18, 'ทองแดง', '1.0x1000x2000 มม.'],
  blkPipe2:  ['ท่อเหล็กดำ 2" หนา 3.5 มม. (6 ม.)', 1650, 1320, 200, 'ท่อเหล็ก', '2" หนา 3.5 มม. ยาว 6 ม.'],
  galPipe1:  ['ท่อเหล็กชุบสังกะสี 1" (6 ม.)', 720, 560, 340, 'ท่อเหล็ก', '1" ยาว 6 ม.'],
  ssPipe:    ['ท่อสแตนเลส 304 1-1/2" (6 ม.)', 3950, 3200, 3, 'ท่อเหล็ก', 'SUS304 1-1/2" ยาว 6 ม.'],
  steelPlate:['เหล็กแผ่นดำ 3 มม. 4x8 ฟุต', 3200, 2650, 45, 'วัสดุโลหะ', '3 มม. 4x8 ฟุต'],
  angle:     ['เหล็กฉาก 50x50x5 มม. (6 ม.)', 890, 700, 150, 'วัสดุโลหะ', '50x50x5 มม. ยาว 6 ม.'],
  tee:       ['ข้อต่อสามทางทองแดง 1/2"', 65, 44, 500, 'อุปกรณ์ข้อต่อ', '1/2"'],
  flange:    ['หน้าแปลนเหล็ก 4" JIS 10K', 480, 350, 80, 'อุปกรณ์ข้อต่อ', '4" JIS 10K'],
};

await db.collection('products').insertMany(Object.values(CATALOG).map(([name, price, cost, stock, type, spec]) => ({
  productType: 'general', brand: 'KOUSOKU', model: name, size: spec, type, note: NOTE,
  description: `${name} — ${NOTE}`, warranty: '',
  priceCash: price, priceCredit: price, priceInstallment: price, costPrice: cost,
  image: '/logo/logokosoku.png', images: [], category: 'general', stock, year: String(today.getFullYear()).slice(-2),
  published: true, createdAt: daysAgo(160), ...S,
})));

// ── ลูกค้า ──────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { co: 'บริษัท สยามคอนสตรัคชั่น จำกัด', tax: '0105551000011', phone: '02-111-2233', email: 'purchase@siam-construction.example', addr: '88/9 ถ.พระราม 9 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310' },
  { co: 'บริษัท เอกวิศวกรรม จำกัด', tax: '0105552000022', phone: '02-222-3344', email: 'buy@ek-engineering.example', addr: '12 ซ.ลาดพร้าว 71 แขวงลาดพร้าว เขตลาดพร้าว กรุงเทพฯ 10230' },
  { co: 'ห้างหุ้นส่วนจำกัด ท่อเหล็กไทย', tax: '0103553000033', phone: '02-333-4455', email: 'sale@thaipipe.example', addr: '45 หมู่ 4 ถ.เพชรเกษม ต.อ้อมน้อย อ.กระทุ่มแบน จ.สมุทรสาคร 74130' },
  { co: 'บริษัท พลังงานสะอาด จำกัด', tax: '0105554000044', phone: '038-444-556', email: 'procure@cleanpower.example', addr: '99/1 นิคมอุตสาหกรรมอมตะ ต.ดอนหัวฬ่อ อ.เมือง จ.ชลบุรี 20000' },
  { first: 'สมชาย', last: 'ใจดี', phone: '081-234-5678', email: 'somchai.j@example.com', addr: '55/7 ซ.สุขุมวิท 26 แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110' },
  { first: 'วิภา', last: 'รุ่งเรือง', phone: '089-876-5432', email: 'wipa.r@example.com', addr: '21/3 ถ.ติวานนท์ ต.บางกระสอ อ.เมือง จ.นนทบุรี 11000' },
];

await db.collection('customers').insertMany(CUSTOMERS.map((c, i) => ({
  customerType: c.co ? 'corporate' : 'individual', relationType: 'customer',
  firstName: c.first ?? '', lastName: c.last ?? '', companyName: c.co ?? '',
  phone: c.phone, email: c.email, address: c.addr, taxId: c.tax ?? '', branch: c.co ? 'สำนักงานใหญ่' : '',
  carInfo: '', vehicles: [], note: NOTE, source: 'walkin', createdAt: daysAgo(170 - i * 7), updatedAt: daysAgo(3), ...S,
})));

const custName = (i) => CUSTOMERS[i].co ?? `${CUSTOMERS[i].first} ${CUSTOMERS[i].last}`;

// ── ตัวช่วยสร้างเอกสาร ───────────────────────────────────────────────────────
// items: [[key, qty, ส่วนลด%]]  vat: true = บวก VAT 7% เพิ่มจากราคา (เหมือนโหมด "extra" ในฟอร์ม)
function buildTotals(items, vat) {
  const lines = items.map(([key, qty, disc = 0]) => {
    const [name, price, cost] = CATALOG[key];
    const gross = qty * price;
    const net = r2(gross * (1 - disc / 100));
    return { description: name, qty, unitPrice: price, discount: disc, discountType: 'pct', lineTotal: net, productId: null, gross, cost: qty * cost };
  });
  const subtotal = r2(lines.reduce((s, l) => s + l.gross, 0));
  const afterDisc = r2(lines.reduce((s, l) => s + l.lineTotal, 0));
  const vatAmount = vat ? r2(afterDisc * 0.07) : 0;
  return {
    items: lines.map(({ gross, cost, ...l }) => l),
    costPrice: r2(lines.reduce((s, l) => s + l.cost, 0)),
    subtotal, discountTotal: r2(subtotal - afterDisc), vatRate: vat ? 7 : 0, vatAmount, grandTotal: r2(afterDisc + vatAmount),
  };
}

// เลขที่เอกสาร PREFIX-YYYY-NNNN ต่อจากเลขล่าสุดที่ไม่ใช่ตัวอย่าง (กันชนกับเอกสารจริง)
const PREFIX = { invoice: 'INV', quote: 'QT', credit_note: 'CR', billing_note: 'BN', payment_note: 'PN', booking_note: 'RES' };
const seq = {};
async function nextNumber(type, date) {
  const year = date.getFullYear();
  const key = `${PREFIX[type]}-${year}`;
  if (seq[key] === undefined) {
    const last = await db.collection('financialdocuments')
      .find({ docNumber: new RegExp(`^${key}-`), isSample: { $ne: true } }).sort({ docNumber: -1 }).limit(1).toArray();
    seq[key] = last[0] ? parseInt(last[0].docNumber.split('-').pop(), 10) : 0;
  }
  seq[key] += 1;
  return `${key}-${String(seq[key]).padStart(4, '0')}`;
}

const incomes = [];
const inserted = {}; // ref → { _id, docNumber, grandTotal }

async function addDoc(ref, { type, days, cust, items, vat = false, status, payment = 'pending', dueInDays, extra = {} }) {
  const issuedAt = daysAgo(days);
  const docNumber = await nextNumber(type, issuedAt);
  const t = extra.totals ?? buildTotals(items, vat);
  const c = CUSTOMERS[cust];
  const paid = status === 'paid';
  const doc = {
    docNumber, type, source: 'manual', bookingId: null, bookingRef: '', relatedDocId: null, relatedDocNumber: '',
    customerName: custName(cust), customerPhone: c.phone, customerEmail: c.email, customerLineId: '', customerCar: '',
    customerAddress: c.addr, customerTaxId: c.tax ?? '', customerBranch: c.co ? 'สำนักงานใหญ่' : '',
    items: t.items, subtotal: t.subtotal, discountTotal: t.discountTotal, vatRate: t.vatRate, vatAmount: t.vatAmount, grandTotal: t.grandTotal,
    withholdingTaxRate: 0, withholdingAmount: 0,
    paymentMethod: payment, paidAt: paid ? issuedAt : null,
    technicianName: '', depositAmount: 0,
    // ต้นทุนรวมของรายการสินค้า — เฉพาะใบเสร็จ (ใช้คำนวณกำไรในหน้าเอกสาร/รายงาน)
    costPrice: type === 'invoice' ? t.costPrice : null,
    status, note: NOTE, showPaymentInfo: false, issuedAt,
    dueDate: dueInDays === undefined ? null : daysAgo(-dueInDays),
    createdAt: issuedAt, ...extra.fields, ...S,
  };
  const res = await db.collection('financialdocuments').insertOne(doc);
  inserted[ref] = { _id: res.insertedId, docNumber, grandTotal: t.grandTotal };
  if (paid) {
    incomes.push({ category: 'Sales', description: `ชำระเงินบิล ${docNumber} (${doc.customerName})`, amount: t.grandTotal, incomeDate: issuedAt, note: `อ้างอิงเอกสาร ${docNumber}`, createdAt: issuedAt, ...S });
  }
  return inserted[ref];
}

// ใบรับชำระของใบแจ้งหนี้ (ลง Income แบบเดียวกับตอนรับชำระจริง)
async function addPayment(ref, billingRef, days, amount, cust) {
  const bn = inserted[billingRef];
  const issuedAt = daysAgo(days);
  const docNumber = await nextNumber('payment_note', issuedAt);
  const c = CUSTOMERS[cust];
  await db.collection('financialdocuments').insertOne({
    docNumber, type: 'payment_note', source: 'manual', bookingId: null, bookingRef: '', relatedDocId: bn._id, relatedDocNumber: bn.docNumber,
    customerName: custName(cust), customerPhone: c.phone, customerEmail: c.email, customerLineId: '', customerCar: '',
    customerAddress: c.addr, customerTaxId: c.tax ?? '', customerBranch: c.co ? 'สำนักงานใหญ่' : '',
    items: [{ description: `รับชำระใบแจ้งหนี้ ${bn.docNumber}`, qty: 1, unitPrice: amount, discount: 0, discountType: 'pct', lineTotal: amount, productId: null }],
    subtotal: amount, discountTotal: 0, vatRate: 0, vatAmount: 0, grandTotal: amount, withholdingTaxRate: 0, withholdingAmount: 0,
    paymentMethod: 'transfer', paidAt: issuedAt, technicianName: '', depositAmount: 0, costPrice: null,
    status: 'paid', note: NOTE, showPaymentInfo: false, issuedAt, dueDate: null, createdAt: issuedAt, ...S,
  });
  incomes.push({ category: 'Sales', description: `รับชำระสำหรับใบแจ้งหนี้ ${bn.docNumber}`, amount, incomeDate: issuedAt, note: `อ้างอิงใบรับชำระ ${docNumber}`, createdAt: issuedAt, ...S });
  return docNumber;
}

// ── เอกสาร (เรียงจากเก่าไปใหม่ เพื่อให้เลขที่เรียงตามเวลา) ───────────────────────
console.log('📄 สร้างเอกสาร...');

// ใบเสนอราคา
await addDoc('qt1', { type: 'quote', days: 150, cust: 0, items: [['cuPipe78', 40, 5], ['tee', 120, 0]], vat: true, status: 'accepted', dueInDays: -120 });
await addDoc('qt2', { type: 'quote', days: 95, cust: 1, items: [['blkPipe2', 60, 3], ['flange', 24, 0]], vat: true, status: 'accepted', dueInDays: -65 });
await addDoc('qt3', { type: 'quote', days: 55, cust: 3, items: [['cuSheet', 6, 0], ['cuPipe12', 50, 5]], vat: true, status: 'expired', dueInDays: -25 });
await addDoc('qt4', { type: 'quote', days: 12, cust: 2, items: [['galPipe1', 100, 5], ['angle', 40, 0]], vat: true, status: 'pending_approval', dueInDays: 18 });
await addDoc('qt5', { type: 'quote', days: 5, cust: 0, items: [['ssPipe', 12, 0], ['flange', 30, 5]], vat: true, status: 'pending_approval', dueInDays: 25 });

// ใบเสร็จ/ใบกำกับภาษี — ชำระแล้ว (ยอดรายเดือนสำหรับกราฟ)
await addDoc('inv1', { type: 'invoice', days: 140, cust: 0, items: [['cuPipe78', 40, 5], ['tee', 120, 0]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv2', { type: 'invoice', days: 118, cust: 4, items: [['cuPipe12', 6, 0], ['tee', 20, 0]], vat: false, status: 'paid', payment: 'cash' });
await addDoc('inv3', { type: 'invoice', days: 97, cust: 1, items: [['blkPipe2', 60, 3], ['flange', 24, 0]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv4', { type: 'invoice', days: 76, cust: 5, items: [['angle', 8, 0], ['steelPlate', 2, 0]], vat: false, status: 'paid', payment: 'cash' });
await addDoc('inv5', { type: 'invoice', days: 58, cust: 2, items: [['galPipe1', 150, 5], ['angle', 30, 0]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv6', { type: 'invoice', days: 41, cust: 0, items: [['cuPipe12', 80, 4], ['cuPipe78', 20, 4]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv7', { type: 'invoice', days: 27, cust: 3, items: [['cuSheet', 4, 0], ['tee', 60, 0]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv8', { type: 'invoice', days: 15, cust: 4, items: [['galPipe1', 12, 0], ['flange', 4, 0]], vat: false, status: 'paid', payment: 'cash' });
await addDoc('inv9', { type: 'invoice', days: 6, cust: 1, items: [['steelPlate', 10, 3], ['angle', 40, 3]], vat: true, status: 'paid', payment: 'transfer' });
await addDoc('inv10', { type: 'invoice', days: 2, cust: 5, items: [['cuPipe12', 4, 0], ['tee', 16, 0]], vat: false, status: 'paid', payment: 'cash' });

// ใบเสร็จ — ยังไม่ชำระ (ค้างชำระ / เกินกำหนด)
await addDoc('inv11', { type: 'invoice', days: 20, cust: 2, items: [['blkPipe2', 40, 0], ['flange', 16, 0]], vat: true, status: 'unpaid', payment: 'pending', dueInDays: -5 });
await addDoc('inv12', { type: 'invoice', days: 8, cust: 3, items: [['ssPipe', 8, 0]], vat: true, status: 'unpaid', payment: 'pending', dueInDays: 22 });

// ใบแจ้งหนี้ (วางบิล) + ใบรับชำระ
await addDoc('bn3', { type: 'billing_note', days: 70, cust: 3, items: [['cuPipe78', 30, 0], ['tee', 80, 0]], vat: true, status: 'paid', dueInDays: -40 });
await addPayment('pn1', 'bn3', 55, r2(inserted.bn3.grandTotal * 0.5), 3);
await addPayment('pn2', 'bn3', 38, r2(inserted.bn3.grandTotal - r2(inserted.bn3.grandTotal * 0.5)), 3);
await addDoc('bn1', { type: 'billing_note', days: 45, cust: 1, items: [['blkPipe2', 100, 2], ['angle', 60, 2]], vat: true, status: 'unpaid', dueInDays: -15 });
await addDoc('bn2', { type: 'billing_note', days: 30, cust: 0, items: [['cuPipe12', 100, 0], ['cuPipe78', 15, 0]], vat: true, status: 'partial', dueInDays: 15 });
await addPayment('pn3', 'bn2', 10, r2(inserted.bn2.grandTotal * 0.4), 0);

// ใบลดหนี้ (อ้างอิงใบเสร็จ INV6)
await addDoc('cr1', {
  type: 'credit_note', days: 33, cust: 0, items: [['cuPipe12', 5, 4]], vat: true, status: 'issued',
  extra: { fields: { relatedDocId: inserted.inv6._id, relatedDocNumber: inserted.inv6.docNumber } },
});

// ใบจอง
await addDoc('res1', {
  type: 'booking_note', days: 14, cust: 1, items: [['cuSheet', 5, 0]], vat: true, status: 'deposit_paid', dueInDays: 7,
  extra: { fields: { depositAmount: 20000 } },
});
await addDoc('res2', { type: 'booking_note', days: 9, cust: 2, items: [['ssPipe', 10, 0], ['flange', 20, 0]], vat: true, status: 'reserved', dueInDays: 12 });

// ── รายรับ / รายจ่าย ─────────────────────────────────────────────────────────
await db.collection('incomes').insertMany(incomes);

const expenses = [];
for (let m = 5; m >= 0; m--) {
  const d = (day) => new Date(today.getFullYear(), today.getMonth() - m, day, 12, 0, 0);
  expenses.push(
    { category: 'ค่าเช่า', description: 'ค่าเช่าสำนักงาน/โกดัง', amount: 35000, expenseDate: d(1) },
    { category: 'ค่าสาธารณูปโภค', description: 'ค่าน้ำ-ค่าไฟ', amount: 6200 + m * 310, expenseDate: d(5) },
    { category: 'ค่าขนส่ง', description: 'ค่าขนส่งสินค้า', amount: 3400 + ((m * 731) % 2600), expenseDate: d(12) },
  );
  if (m % 2 === 0) expenses.push({ category: 'ค่าใช้จ่ายสำนักงาน', description: 'อุปกรณ์สำนักงาน/วัสดุสิ้นเปลือง', amount: 1850 + m * 120, expenseDate: d(18) });
}
await db.collection('expenses').insertMany(expenses.filter(e => e.expenseDate <= today).map(e => ({ ...e, note: NOTE, createdAt: e.expenseDate, ...S })));

// ── สรุป ────────────────────────────────────────────────────────────────────
console.log('\n✅ สร้างข้อมูลตัวอย่างเสร็จแล้ว');
for (const name of COLLECTIONS) console.log(`   ${name.padEnd(20)} ${await db.collection(name).countDocuments({ isSample: true })}`);
console.log('\nลบทั้งหมดได้ด้วย: node scripts/seed-sample-data.mjs --remove');
await client.close();
