'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, FileText, Package, CalendarCheck, AlertTriangle, Loader2, PiggyBank, FileWarning } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TYPE_LABEL, TYPE_STYLE, STATUS_STYLE } from '@/components/admin/documents/shared';
import { DatePicker } from "@/components/ui/date-picker";

interface DashboardData {
  summary: {
    isRange: boolean;
    rangeDays: number;
    rangeRevenue: number;
    rangeBills: number;
    revenueTrend: string | null;
    billTrend: number | null;
    monthRevenue: number;
    pendingBookings: number;
    rangeBookings: number;
    totalProducts: number;
    totalStock: number;
    totalIncomeMonth: number;
    totalExpenseMonth: number;
    profitMonth: number;
    unpaidDocs: { count: number; amount: number; overdueCount: number };
  };
  recentDocs: {
    id: string;
    docNumber: string;
    type: string;
    customerName: string;
    grandTotal: number;
    status: string;
    activityAt: string;
  }[];
  lowStock: {
    id: string;
    name: string;
    stock: number;
    category: string;
  }[];
  chartData: { month: string; income: number; expense: number; profit: number }[];
  categoryData: { name: string; count: number; stock: number }[];
}

const PIE_COLORS = ['#16a34a','#2563eb','#d97706','#7c3aed','#0891b2'];
const CATEGORY_LABELS: Record<string, string> = {
  touring: 'สินค้าทั่วไป',
  sport: 'สินค้าสมรรถนะสูง',
  eco: 'สินค้าประหยัดพลังงาน',
  suv: 'สินค้าอเนกประสงค์',
  allseason: 'สินค้าใช้งานทุกฤดู',
};

function fmt(n: number) {
  return n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState<string>(''); // YYYY-MM-DD
  const [dateTo,   setDateTo]   = useState<string>('');

  function buildUrl() {
    const params = new URLSearchParams();
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    return params.toString() ? `/api/admin/dashboard?${params.toString()}` : '/api/admin/dashboard';
  }

  useEffect(() => {
    setLoading(true);
    fetch(buildUrl())
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => { setError('โหลดข้อมูลไม่ได้'); setLoading(false); });
  }, [dateFrom, dateTo]);

  if (loading && !data) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Loader2 size={28} className="animate-spin mr-3" />กำลังโหลดข้อมูล...
    </div>
  );

  if (error || !data) return (
    <div className="flex items-center justify-center h-64 text-red-400 gap-2">
      <AlertTriangle size={20} />{error || 'ไม่พบข้อมูล'}
    </div>
  );

  const { summary, recentDocs, lowStock, chartData, categoryData } = data;

  const financeCards = [
    {
      title: 'ยอดขายเดือนนี้',
      value: `฿${fmt(summary.monthRevenue)}`,
      trend: 'ยอดสะสมเดือนปัจจุบัน',
      trendUp: true, isNeutral: true,
      icon: <TrendingUp size={18} />,
      iconClass: 'text-emerald-600', iconBg: 'bg-emerald-50',
    },
    {
      title: 'รายรับเดือนนี้',
      value: `฿${fmt(summary.totalIncomeMonth)}`,
      trend: 'รวมทุกช่องทาง',
      trendUp: true, isNeutral: true,
      icon: <DollarSign size={18} />,
      iconClass: 'text-teal-600', iconBg: 'bg-teal-50',
    },
    {
      title: 'รายจ่ายเดือนนี้',
      value: `฿${fmt(summary.totalExpenseMonth)}`,
      trend: 'ค่าสินค้าและจิปาถะ',
      trendUp: false, isNeutral: true,
      icon: <AlertTriangle size={18} />,
      iconClass: 'text-rose-600', iconBg: 'bg-rose-50',
    },
    {
      title: 'กำไรเดือนนี้',
      value: `${summary.profitMonth < 0 ? '-' : ''}฿${fmt(Math.abs(summary.profitMonth))}`,
      trend: 'รายรับ – รายจ่าย',
      trendUp: summary.profitMonth >= 0, isNeutral: false,
      icon: <PiggyBank size={18} />,
      iconClass: summary.profitMonth >= 0 ? 'text-emerald-600' : 'text-rose-600',
      iconBg: summary.profitMonth >= 0 ? 'bg-emerald-50' : 'bg-rose-50',
    },
  ];

  const opsCards = [
    {
      title: summary.isRange ? 'ยอดขายช่วงที่เลือก' : 'ยอดขายวันนี้',
      value: `฿${fmt(summary.rangeRevenue)}`,
      trend: summary.isRange
        ? `รวม ${summary.rangeDays} วัน · ${summary.rangeBills} บิล`
        : summary.revenueTrend
          ? `${Number(summary.revenueTrend) >= 0 ? '▲' : '▼'} ${Math.abs(Number(summary.revenueTrend))}% จากเมื่อวาน`
          : 'ยังไม่มียอดเมื่อวาน',
      trendUp: summary.isRange ? false : Number(summary.revenueTrend ?? 0) >= 0,
      isNeutral: summary.isRange,
      icon: <DollarSign size={18} />,
      iconClass: 'text-indigo-600', iconBg: 'bg-indigo-50',
    },
    {
      title: summary.isRange ? 'บิลขายช่วงที่เลือก' : 'บิลขายวันนี้',
      value: `${summary.rangeBills} บิล`,
      trend: summary.isRange || summary.billTrend === null
        ? 'ในช่วงที่เลือก'
        : `${summary.billTrend >= 0 ? '▲' : '▼'} ${Math.abs(summary.billTrend)} บิล จากเมื่อวาน`,
      trendUp: summary.isRange ? false : (summary.billTrend ?? 0) >= 0,
      isNeutral: summary.isRange,
      icon: <FileText size={18} />,
      iconClass: 'text-blue-600', iconBg: 'bg-blue-50',
    },
    {
      title: 'เอกสารค้างชำระ',
      value: `${summary.unpaidDocs.count} ฉบับ`,
      trend: summary.unpaidDocs.count === 0
        ? 'ไม่มียอดค้าง'
        : `฿${fmt(summary.unpaidDocs.amount)}${summary.unpaidDocs.overdueCount > 0 ? ` · เกินกำหนด ${summary.unpaidDocs.overdueCount}` : ''}`,
      trendUp: false, isNeutral: summary.unpaidDocs.count === 0,
      icon: <FileWarning size={18} />,
      iconClass: 'text-red-600', iconBg: 'bg-red-50',
    },
    {
      title: 'การจองรออนุมัติ',
      value: `${summary.pendingBookings} รายการ`,
      trend: summary.isRange ? `จองใหม่ในช่วงที่เลือก ${summary.rangeBookings} ราย` : `จองใหม่วันนี้ ${summary.rangeBookings} ราย`,
      trendUp: false, isNeutral: true,
      icon: <CalendarCheck size={18} />,
      iconClass: 'text-violet-600', iconBg: 'bg-violet-50',
    },
    {
      title: 'สินค้าทั้งหมด',
      value: `${fmt(summary.totalProducts)} SKU`,
      trend: `คงคลัง ${fmt(summary.totalStock)} ชิ้น`,
      trendUp: true, isNeutral: true,
      icon: <Package size={18} />,
      iconClass: 'text-slate-600', iconBg: 'bg-slate-100',
    },
  ];

  const thDate = summary.isRange
    ? `${new Date(dateFrom || dateTo).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} – ${new Date(dateTo || dateFrom).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : new Date(dateFrom || dateTo || Date.now()).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
          <div className="text-sm text-slate-500 font-medium mt-1">ข้อมูล ณ วันที่ {thDate}</div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DatePicker value={dateFrom} max={dateTo || undefined} onChange={e => setDateFrom(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
          <span className="text-slate-400 text-sm">–</span>
          <DatePicker value={dateTo} min={dateFrom || undefined} onChange={e => setDateTo(e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
          <button
            onClick={() => {
              setLoading(true);
              fetch(buildUrl()).then(r => r.json()).then(d => { setData(d); setLoading(false); });
            }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Loader2 size={14} />} รีเฟรช
          </button>
        </div>
      </div>

      {/* Finance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {financeCards.map((card, idx) => (
          <div key={`fin-${idx}`} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute right-0 top-0 opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-transform pointer-events-none -mr-4 -mt-4">
               <DollarSign size={100} className={card.iconClass} />
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`${card.iconBg} w-10 h-10 rounded-xl flex items-center justify-center ${card.iconClass}`}>
                {card.icon}
              </div>
              <p className="text-sm text-slate-500 font-bold">{card.title}</p>
            </div>
            <div className="text-3xl font-black text-slate-900 leading-tight mb-2 tracking-tight">{card.value}</div>
            <div className={`text-xs font-semibold ${card.isNeutral ? 'text-slate-400' : (card.trendUp ? 'text-emerald-600' : 'text-rose-500')}`}>
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Ops Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {opsCards.map((card, idx) => (
          <div key={`ops-${idx}`} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className={`${card.iconBg} w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${card.iconClass}`}>
              {card.icon}
            </div>
            <p className="text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wide">{card.title}</p>
            <div className="text-xl font-black text-slate-800 leading-tight">{card.value}</div>
            <div className={`text-[10px] font-bold mt-1.5 ${card.isNeutral ? 'text-slate-400' : (card.trendUp ? 'text-emerald-600' : 'text-red-500')}`}>
              {card.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Income vs Expense (6 เดือน) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">รายรับ–รายจ่าย 6 เดือนล่าสุด</h3>
            <span className="text-xs text-slate-400">เส้น = กำไร (รายรับ – รายจ่าย)</span>
          </div>
          {chartData.every(d => d.income === 0 && d.expense === 0) ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">ยังไม่มีข้อมูลรายรับ/รายจ่าย</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `฿${Number(v).toLocaleString()}`} />
                <Tooltip
                  formatter={(v, n) => [`฿${fmt(Number(v))}`, n as string]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="income" name="รายรับ" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" name="รายจ่าย" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line type="monotone" dataKey="profit" name="กำไร" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 3.5, fill: '#2563eb' }} />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-5">สัดส่วนสินค้า</h3>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-400 text-sm">ยังไม่มีสินค้า</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="name">
                  {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Legend formatter={v => CATEGORY_LABELS[v] ?? v} wrapperStyle={{ fontSize: 11 }} />
                <Tooltip formatter={(v, n) => [v, CATEGORY_LABELS[n as string] ?? n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Documents */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800">เอกสารเคลื่อนไหวล่าสุด</h3>
            <a href="/admin/documents" className="text-xs font-semibold text-green-600 hover:text-green-700">ดูทั้งหมด →</a>
          </div>
          {recentDocs.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">ยังไม่มีเอกสาร</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-xs font-bold text-slate-500 text-left">เลขที่</th>
                    <th className="pb-3 text-xs font-bold text-slate-500 text-left">ประเภท</th>
                    <th className="pb-3 text-xs font-bold text-slate-500 text-left">ลูกค้า</th>
                    <th className="pb-3 text-xs font-bold text-slate-500 text-right">ยอดรวม</th>
                    <th className="pb-3 text-xs font-bold text-slate-500 text-center">สถานะ</th>
                    <th className="pb-3 text-xs font-bold text-slate-500 text-right">วันที่</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map(doc => {
                    const st = STATUS_STYLE[doc.status];
                    return (
                      <tr key={doc.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 text-xs font-mono">
                          <a href={`/admin/documents/${doc.id}/print`} className="text-slate-500 hover:text-green-700 hover:underline">{doc.docNumber}</a>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md border whitespace-nowrap ${TYPE_STYLE[doc.type] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {TYPE_LABEL[doc.type] ?? doc.type}
                          </span>
                        </td>
                        <td className="py-3 text-xs font-medium text-slate-700 max-w-[140px] truncate">{doc.customerName}</td>
                        <td className="py-3 text-xs font-bold text-slate-900 text-right">฿{fmt(doc.grandTotal)}</td>
                        <td className="py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border whitespace-nowrap ${st?.className ?? 'bg-slate-50 text-slate-500 border-slate-200/50'}`}>{st?.label ?? doc.status}</span>
                        </td>
                        <td className="py-3 text-xs text-slate-400 text-right whitespace-nowrap">
                          {new Date(doc.activityAt).toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              สินค้าใกล้หมด
            </h3>
            <a href="/admin/products" className="text-xs font-semibold text-green-600 hover:text-green-700">จัดการ →</a>
          </div>
          {lowStock.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-sm">✅ สินค้าทุกรายการมีเพียงพอ</div>
          ) : (
            <div className="space-y-3">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${p.stock === 0 ? 'bg-red-500' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">{CATEGORY_LABELS[p.category] ?? p.category}</p>
                  </div>
                  <span className={`text-xs font-black shrink-0 ${p.stock === 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {p.stock === 0 ? 'หมด' : `${p.stock} ชิ้น`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-400 mt-8 mb-2 flex justify-between">
        <span>© {new Date().getFullYear()} Kosoku สงวนลิขสิทธิ์ทุกประการ</span>
        <span>เวอร์ชั่น 1.0.0</span>
      </div>
    </div>
  );
}
