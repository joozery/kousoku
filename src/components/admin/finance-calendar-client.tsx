'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Wallet, PiggyBank, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { FinanceCalendar, CalendarDay } from '@/lib/finance-calendar';

const WEEKDAYS = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
const MONTHS_FULL = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
const MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

// จัดรูปแบบวันที่เองแทน toLocaleDateString('th-TH') — ผลของ Intl ต่างกันระหว่าง server/เบราว์เซอร์ ทำให้ hydration ไม่ตรง
function parseDay(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d, weekday: new Date(y, m - 1, d).getDay() };
}
const dayLong  = (date: string) => { const { y, m, d } = parseDay(date); return `${d} ${MONTHS_FULL[m - 1]} ${y + 543}`; };
const dayShort = (date: string) => { const { m, d, weekday } = parseDay(date); return `${WEEKDAYS[weekday]} ${d} ${MONTHS_SHORT[m - 1]}`; };

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const compact = (n: number) => n.toLocaleString('th-TH', { maximumFractionDigits: 0 });
const signed = (n: number) => `${n < 0 ? '-' : ''}฿${money(Math.abs(n))}`;

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function StatCard({ label, value, tone, icon }: { label: string; value: string; tone: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-500 text-sm font-medium">{label}</span>
        <div className={`p-2 rounded-xl ${tone}`}>{icon}</div>
      </div>
      <p className="text-2xl font-black text-slate-900">{value}</p>
    </div>
  );
}

export function FinanceCalendarClient({ data, currentMonth }: { data: FinanceCalendar; currentMonth: string }) {
  const [year, month] = data.month.split('-').map(Number);
  const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const [selected, setSelected] = useState<string | null>(null);

  const dayMap = useMemo(() => new Map(data.days.map(d => [d.date, d])), [data.days]);
  const monthLabel = `${MONTHS_FULL[month - 1]} ${year + 543}`;

  // ช่องว่างก่อนวันที่ 1 + วันในเดือน
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: (string | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => `${data.month}-${String(i + 1).padStart(2, '0')}`),
  ];

  const selectedDay: CalendarDay | undefined = selected ? dayMap.get(selected) : undefined;
  const net = data.totalIncome - data.totalExpense;
  const prev = shiftMonth(data.month, -1);
  const next = shiftMonth(data.month, 1);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/finance" className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800" title="กลับหน้าการเงิน">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">ปฏิทินการเงิน</h1>
            <p className="text-slate-500 text-sm mt-0.5">สรุปรายรับ / รายจ่าย / ยอดคงเหลือ รายวัน</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/admin/finance/calendar?month=${prev}`} aria-label="เดือนก่อนหน้า" className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
            <ChevronLeft size={18} />
          </Link>
          <div className="min-w-44 text-center px-4 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-800">{monthLabel}</div>
          <Link href={`/admin/finance/calendar?month=${next}`} aria-label="เดือนถัดไป" className="w-10 h-10 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50">
            <ChevronRight size={18} />
          </Link>
          {data.month !== currentMonth && (
            <Link href="/admin/finance/calendar" className="h-10 px-4 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 flex items-center">
              เดือนนี้
            </Link>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="ยอดยกมา" value={signed(data.openingBalance)} tone="bg-slate-100 text-slate-500" icon={<Wallet size={18} />} />
        <StatCard label="รายรับเดือนนี้" value={`฿${money(data.totalIncome)}`} tone="bg-emerald-50 text-emerald-600" icon={<TrendingUp size={18} />} />
        <StatCard label="รายจ่ายเดือนนี้" value={`฿${money(data.totalExpense)}`} tone="bg-red-50 text-red-500" icon={<TrendingDown size={18} />} />
        <StatCard
          label="ยอดคงเหลือสิ้นเดือน"
          value={signed(data.closingBalance)}
          tone={data.closingBalance >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-500'}
          icon={<PiggyBank size={18} />}
        />
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
          {WEEKDAYS.map(w => (
            <div key={w} className="py-2.5 text-center text-xs font-bold text-slate-500">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={`b${i}`} className="min-h-24 border-b border-r border-slate-50 bg-slate-50/40" />;
            const day = dayMap.get(date);
            const isToday = date === todayKey;
            const isSel = date === selected;
            return (
              <button
                key={date}
                type="button"
                disabled={!day}
                onClick={() => setSelected(isSel ? null : date)}
                className={`min-h-24 border-b border-r border-slate-100 p-1.5 sm:p-2 text-left align-top transition-colors flex flex-col gap-0.5
                  ${day ? 'hover:bg-slate-50 cursor-pointer' : 'cursor-default'} ${isSel ? 'bg-blue-50/60 ring-2 ring-inset ring-blue-400' : ''}`}
              >
                <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-green-600 text-white' : 'text-slate-600'}`}>
                  {Number(date.slice(8))}
                </span>
                {day && (
                  <>
                    {day.income > 0 && <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 leading-tight">+{compact(day.income)}</span>}
                    {day.expense > 0 && <span className="text-[10px] sm:text-[11px] font-semibold text-red-500 leading-tight">−{compact(day.expense)}</span>}
                    <span className={`mt-auto text-[10px] font-bold leading-tight ${day.balance >= 0 ? 'text-slate-500' : 'text-red-500'}`} title="ยอดคงเหลือสะสม ณ สิ้นวัน">
                      คงเหลือ {compact(day.balance)}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-900">
              รายการวันที่ {dayLong(selectedDay.date)}
            </h2>
            <button type="button" onClick={() => setSelected(null)} className="text-xs font-semibold text-slate-400 hover:text-slate-700">ปิด</button>
          </div>
          <ul className="divide-y divide-slate-50">
            {selectedDay.txs.map(t => (
              <li key={t.id + t.ref} className="flex items-center gap-3 py-2.5">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${t.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                  {t.type === 'in' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 truncate">{t.desc}</p>
                  <p className="text-xs text-slate-400">
                    {t.href ? <Link href={t.href} className="hover:text-green-700 hover:underline">{t.ref}</Link> : t.ref}
                  </p>
                </div>
                <span className={`text-sm font-bold tabular-nums ${t.type === 'in' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {t.type === 'in' ? '+' : '−'}฿{money(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily summary table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">สรุปรายวัน — {monthLabel}</h2>
          <p className="text-xs text-slate-400 mt-0.5">แสดงเฉพาะวันที่มีการเคลื่อนไหว · คงเหลือ = ยอดยกมา + รายรับ − รายจ่ายสะสม</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">วันที่</th>
                <th className="px-5 py-3 text-right font-semibold">รายรับ</th>
                <th className="px-5 py-3 text-right font-semibold">รายจ่าย</th>
                <th className="px-5 py-3 text-right font-semibold">สุทธิ</th>
                <th className="px-5 py-3 text-right font-semibold">คงเหลือสะสม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.days.length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-slate-400">ไม่มีการเคลื่อนไหวทางการเงินในเดือนนี้</td></tr>
              )}
              {data.days.map(d => (
                <tr key={d.date} onClick={() => setSelected(d.date)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="px-5 py-3 font-medium text-slate-700">
                    {dayShort(d.date)}
                    <span className="ml-2 text-xs text-slate-400">{d.txs.length} รายการ</span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-emerald-600">{d.income > 0 ? money(d.income) : '—'}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-red-500">{d.expense > 0 ? money(d.expense) : '—'}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-semibold ${d.net >= 0 ? 'text-slate-800' : 'text-red-500'}`}>{signed(d.net)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-bold ${d.balance >= 0 ? 'text-slate-900' : 'text-red-500'}`}>{signed(d.balance)}</td>
                </tr>
              ))}
            </tbody>
            {data.days.length > 0 && (
              <tfoot className="bg-slate-50 font-bold text-slate-800">
                <tr>
                  <td className="px-5 py-3">รวมเดือนนี้</td>
                  <td className="px-5 py-3 text-right tabular-nums text-emerald-600">{money(data.totalIncome)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-red-500">{money(data.totalExpense)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums ${net >= 0 ? '' : 'text-red-500'}`}>{signed(net)}</td>
                  <td className={`px-5 py-3 text-right tabular-nums ${data.closingBalance >= 0 ? '' : 'text-red-500'}`}>{signed(data.closingBalance)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
