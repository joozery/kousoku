import { notFound } from 'next/navigation';
import { getPayslipsForPrint } from '@/lib/payroll';
import { getDocumentSettings } from '@/lib/document-settings';
import { PrintPageShell } from '@/components/admin/documents/print-page-shell';
import { PayslipTemplate, payslipPeriodLabel } from '@/components/admin/payroll/payslip-template';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'พิมพ์สลิปเงินเดือน | Admin' };

// /admin/payroll/print?period=YYYY-MM          → สลิปทุกคนในรอบ (1 คน/1 หน้า)
// /admin/payroll/print?period=YYYY-MM&id=<id>  → สลิปรายคน
export default async function PayslipPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; id?: string }>;
}) {
  const { period, id } = await searchParams;
  if (!period || !/^\d{4}-\d{2}$/.test(period)) notFound();
  if (id && !/^[a-f\d]{24}$/i.test(id)) notFound();

  const [slips, seller] = await Promise.all([getPayslipsForPrint(period, id), getDocumentSettings()]);
  if (slips.length === 0) notFound();

  return (
    <PrintPageShell toolbarExtra={<span className="text-xs text-slate-500">งวด {payslipPeriodLabel(period)}</span>}>
      {slips.map(slip => <PayslipTemplate key={slip.id} slip={slip} seller={seller} />)}
    </PrintPageShell>
  );
}
