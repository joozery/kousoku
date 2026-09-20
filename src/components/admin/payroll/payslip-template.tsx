import { numberToThaiBahtText } from '@/lib/thai-baht-text';
import type { PayslipPrintRow } from '@/lib/payroll';
import type { IDocumentSettings } from '@/models/DocumentSettings';

const THAI_MONTHS = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export function payslipPeriodLabel(period: string) {
  const [y, m] = period.split('-').map(Number);
  return `${THAI_MONTHS[m - 1]} ${y + 543}`;
}

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const hours = (min: number) => (min / 60).toLocaleString('th-TH', { maximumFractionDigits: 1 });

type Line = { label: string; detail?: string; amount: number };

function LineTable({ title, lines, total, totalLabel, tone }: { title: string; lines: Line[]; total: number; totalLabel: string; tone: string }) {
  return (
    <div className="flex flex-col rounded-lg border overflow-hidden" style={{ borderColor: `${tone}40` }}>
      <div className="px-3 py-1.5 text-[13px] font-bold text-white" style={{ backgroundColor: tone }}>{title}</div>
      <div className="flex-1">
        {lines.map(l => (
          <div key={l.label} className="flex items-baseline justify-between gap-3 px-3 py-1.5 border-b border-slate-100 text-[13px]">
            <span className="text-slate-800">
              {l.label}
              {l.detail && <span className="ml-1.5 text-[11px] text-slate-500">{l.detail}</span>}
            </span>
            <span className="tabular-nums font-medium text-slate-900">{l.amount > 0 ? money(l.amount) : '—'}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between px-3 py-2 text-[13px] font-bold" style={{ backgroundColor: `${tone}14` }}>
        <span>{totalLabel}</span>
        <span className="tabular-nums">{money(total)}</span>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <p className="text-[13px]">
      <span className="text-[11px] text-slate-500 mr-1.5">{label}</span>
      <span className="font-semibold text-slate-900">{value || '—'}</span>
    </p>
  );
}

export function PayslipTemplate({ slip, seller }: { slip: PayslipPrintRow; seller: IDocumentSettings }) {
  const earnings: Line[] = [
    { label: 'เงินเดือน', amount: slip.baseSalary },
    { label: 'ค่าล่วงเวลา (OT)', detail: slip.otMinutes > 0 ? `${hours(slip.otMinutes)} ชม. × ${money(slip.otRate)}` : undefined, amount: slip.otPay },
    { label: 'โบนัส/เงินเพิ่ม', amount: slip.bonus },
  ];
  const deductions: Line[] = [
    { label: 'ขาดงาน', detail: slip.daysAbsent > 0 ? `${slip.daysAbsent} วัน` : undefined, amount: slip.absentDeduct },
    { label: 'มาสาย', detail: slip.lateMinutes > 0 ? `${hours(slip.lateMinutes)} ชม.` : undefined, amount: slip.lateDeduct },
    { label: 'ลา (ไม่รับค่าจ้าง)', detail: slip.daysLeaveUnpaid > 0 ? `${slip.daysLeaveUnpaid} วัน` : undefined, amount: slip.leaveDeduct },
    { label: 'ประกันสังคม', amount: slip.sss },
    { label: 'หักอื่น ๆ', amount: slip.otherDeduct },
  ];
  const totalEarn = slip.baseSalary + slip.otPay + slip.bonus;
  const totalDeduct = slip.absentDeduct + slip.lateDeduct + slip.leaveDeduct + slip.sss + slip.otherDeduct;
  const paidDate = slip.paidAt
    ? new Date(slip.paidAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <div id="print-document" style={{ width: '210mm', minHeight: '148mm', background: 'white', padding: '8mm 12mm' }} className="text-slate-800 text-[14px] flex flex-col gap-3">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          {seller.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={seller.logoUrl} alt={seller.companyName} className="h-9 w-auto object-contain mb-1" />
          ) : (
            <p className="text-lg font-black text-slate-900">{seller.companyName || 'บริษัทของคุณ'}</p>
          )}
          {seller.logoUrl && seller.companyName && <p className="text-[13px] font-bold text-slate-900">{seller.companyName}</p>}
          {seller.address && <p className="text-[11px] text-slate-700 max-w-[110mm]">{seller.address}</p>}
          {seller.taxId && <p className="text-[11px] text-slate-700">เลขประจำตัวผู้เสียภาษี {seller.taxId}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-black text-emerald-700">สลิปเงินเดือน</p>
          <p className="text-[12px] font-bold text-slate-700 tracking-widest">PAYSLIP</p>
          <p className="text-[13px] mt-1">งวด <span className="font-bold">{payslipPeriodLabel(slip.period)}</span></p>
        </div>
      </div>

      {/* Employee */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-1 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-2.5">
        <Info label="ชื่อ-นามสกุล" value={slip.employeeName} />
        <Info label="รหัสพนักงาน" value={slip.empId} />
        <Info label="ตำแหน่ง" value={slip.role} />
        <Info label="วันที่จ่าย" value={paidDate || (slip.status === 'paid' ? '' : 'ยังไม่จ่าย')} />
        <Info label="ธนาคาร" value={slip.bankName} />
        <Info label="เลขบัญชี" value={slip.bankAccount} />
      </div>

      {/* Earnings / Deductions */}
      <div className="grid grid-cols-2 gap-3">
        <LineTable title="รายได้" lines={earnings} total={totalEarn} totalLabel="รวมรายได้" tone="#047857" />
        <LineTable title="รายการหัก" lines={deductions} total={totalDeduct} totalLabel="รวมรายการหัก" tone="#b91c1c" />
      </div>

      {/* Net */}
      <div className="flex items-center justify-between gap-4 rounded-lg px-4 py-3 border" style={{ backgroundColor: '#04785714', borderColor: '#04785740' }}>
        <div>
          <p className="text-[12px] text-slate-600">เงินได้สุทธิ</p>
          <p className="text-[12px] font-semibold text-slate-800">({numberToThaiBahtText(slip.netPay)})</p>
        </div>
        <p className="text-2xl font-black text-emerald-800 tabular-nums">{money(slip.netPay)} <span className="text-sm font-bold">บาท</span></p>
      </div>

      {/* Attendance summary */}
      <p className="text-[11px] text-slate-600">
        สรุปการทำงาน: มาทำงาน {slip.daysWorked} วัน · ขาด {slip.daysAbsent} วัน · ลาได้รับค่าจ้าง {slip.daysLeavePaid} วัน · ลาไม่รับค่าจ้าง {slip.daysLeaveUnpaid} วัน · สาย {slip.lateMinutes} นาที · OT {hours(slip.otMinutes)} ชม.
      </p>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-10 mt-auto pt-6 text-center text-[12px]">
        <div>
          <div className="border-b border-slate-400 h-8" />
          <p className="mt-1 text-slate-700">ผู้จ่ายเงิน{seller.issuerName ? ` (${seller.issuerName})` : ''}</p>
        </div>
        <div>
          <div className="border-b border-slate-400 h-8" />
          <p className="mt-1 text-slate-700">ผู้รับเงิน ({slip.employeeName})</p>
        </div>
      </div>
    </div>
  );
}
