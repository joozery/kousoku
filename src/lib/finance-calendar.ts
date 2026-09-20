import { getFinanceSummary, type FinanceTransaction } from './finance';

export type CalendarDayTx = Pick<FinanceTransaction, 'id' | 'desc' | 'ref' | 'type' | 'amount' | 'href'>;

export type CalendarDay = {
  date:    string; // YYYY-MM-DD (เวลาไทย)
  income:  number;
  expense: number;
  net:     number;
  balance: number; // ยอดคงเหลือสะสม ณ สิ้นวัน (รวมยอดยกมาก่อนเดือนนี้)
  txs:     CalendarDayTx[];
};

export type FinanceCalendar = {
  month:          string; // YYYY-MM
  openingBalance: number; // ยอดยกมา = รายรับ–รายจ่ายสะสมก่อนวันที่ 1 ของเดือน
  totalIncome:    number;
  totalExpense:   number;
  closingBalance: number;
  days:           CalendarDay[]; // เฉพาะวันที่มีการเคลื่อนไหว เรียงตามวัน
};

const bangkokDay = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

// ปฏิทินการเงินรายเดือน — ใช้ getFinanceSummary ตัวเดียวกับหน้า "การเงิน" ตัวเลขจึงตรงกันเสมอ
export async function getFinanceCalendar(year: number, month: number): Promise<FinanceCalendar> {
  const start = new Date(year, month - 1, 1);
  const end   = new Date(year, month, 0, 23, 59, 59, 999);

  const [summary, before] = await Promise.all([
    getFinanceSummary(start, end),
    getFinanceSummary(new Date(2000, 0, 1), new Date(start.getTime() - 1)),
  ]);

  const byDay = new Map<string, CalendarDayTx[]>();
  for (const t of summary.transactions) {
    const key = bangkokDay(t.date);
    const list = byDay.get(key) ?? [];
    list.push({ id: t.id, desc: t.desc, ref: t.ref, type: t.type, amount: t.amount, href: t.href });
    byDay.set(key, list);
  }

  let balance = before.netProfit;
  const days: CalendarDay[] = [...byDay.keys()].sort().map(date => {
    const txs = byDay.get(date)!;
    const income  = txs.filter(t => t.type === 'in').reduce((s, t) => s + t.amount, 0);
    const expense = txs.filter(t => t.type === 'out').reduce((s, t) => s + t.amount, 0);
    balance += income - expense;
    return { date, income, expense, net: income - expense, balance, txs };
  });

  return {
    month: `${year}-${String(month).padStart(2, '0')}`,
    openingBalance: before.netProfit,
    totalIncome:    summary.totalIncome,
    totalExpense:   summary.totalExpense,
    closingBalance: before.netProfit + summary.netProfit,
    days,
  };
}
