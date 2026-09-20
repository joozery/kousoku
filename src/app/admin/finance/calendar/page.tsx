import { getFinanceCalendar } from '@/lib/finance-calendar';
import { FinanceCalendarClient } from '@/components/admin/finance-calendar-client';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'ปฏิทินการเงิน | Admin' };

export default async function FinanceCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;
  const current = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }).slice(0, 7);
  const valid = month && /^\d{4}-(0[1-9]|1[0-2])$/.test(month) ? month : current;
  const [y, m] = valid.split('-').map(Number);

  const data = await getFinanceCalendar(y, m);
  return <FinanceCalendarClient data={data} currentMonth={current} />;
}
