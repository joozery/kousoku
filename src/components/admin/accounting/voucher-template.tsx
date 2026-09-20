import { numberToThaiBahtText } from '@/lib/thai-baht-text';
import { dateSlash } from '@/lib/withholding-form';
import type { AccountingDocRow } from '@/lib/accounting-docs';
import type { IDocumentSettings } from '@/models/DocumentSettings';

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PAY_LABEL = { cash: 'เงินสด', transfer: 'โอนเงิน', cheque: 'เช็ค' } as const;

// ใบสำคัญจ่าย / ใบสำคัญรับ — รูปแบบตามตัวอย่างของบริษัท (KSK2601027)
export function VoucherTemplate({ doc, seller }: { doc: AccountingDocRow; seller: IDocumentSettings }) {
  const isPay = doc.kind === 'payment_voucher';
  const title = isPay ? 'ใบสำคัญจ่าย' : 'ใบสำคัญรับ';
  const partyLabel = isPay ? 'จ่ายให้ / Pay to' : 'รับจาก / Received from';
  const byLabel = isPay ? 'จ่ายโดย' : 'รับโดย';
  const netLabel = isPay ? 'จ่ายสุทธิ' : 'รับสุทธิ';
  // เว้นแถวเปล่าให้ครบอย่างน้อย 5 แถว เหมือนแบบฟอร์มกระดาษ
  const blanks = Math.max(0, 5 - doc.items.length);

  return (
    <div id="print-document" style={{ width: '210mm', minHeight: '148mm', background: 'white', padding: '10mm 14mm' }} className="text-slate-900 text-[14px]">
      <h1 className="text-center text-2xl font-black tracking-wide">{seller.companyName || 'บริษัทของคุณ'}</h1>

      <div className="mt-4 flex items-end justify-between">
        <p className="text-lg font-bold">{title}</p>
        <div className="w-[62mm] space-y-1 text-[13px]">
          <div className="flex items-end gap-2">
            <span className="whitespace-nowrap font-bold">เลขที่ / No.</span>
            <span className="flex-1 text-center">{doc.docNumber}</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="whitespace-nowrap font-bold">วันที่ / Date</span>
            <span className="flex-1 border-b border-slate-800 text-center">{dateSlash(doc.issuedAt)}</span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-[13px]"><span className="mr-2">{partyLabel}</span><span className="font-semibold">{doc.partyName}</span></p>

      <table className="mt-2 w-full border-2 border-slate-900 text-[13px]" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="border-b-2 border-slate-900">
            <th className="py-1.5 text-center font-bold">รายการ / Description</th>
            <th className="w-[46mm] border-l-2 border-slate-900 py-1.5 text-center font-bold">จำนวนเงิน / Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-dashed border-slate-500">
            <td className="px-2 py-1.5">{doc.refDocNo ? `ใบกำกับเลขที่ ${doc.refDocNo}` : 'ใบกำกับเลขที่'}</td>
            <td className="border-l-2 border-slate-900 px-2 py-1.5" />
          </tr>
          {doc.items.map((it, i) => (
            <tr key={i} className="border-b border-dashed border-slate-500">
              <td className="px-2 py-1.5 text-center">{it.description}</td>
              <td className="border-l-2 border-slate-900 px-2 py-1.5 text-right tabular-nums">฿{money(it.amount)}</td>
            </tr>
          ))}
          {Array.from({ length: blanks }).map((_, i) => (
            <tr key={`b${i}`} className="border-b border-dashed border-slate-500">
              <td className="px-2 py-1.5">&nbsp;</td>
              <td className="border-l-2 border-slate-900 px-2 py-1.5" />
            </tr>
          ))}
          <tr>
            <td className="px-2 py-1.5 text-right font-bold">{netLabel}</td>
            <td className="border-l-2 border-slate-900 px-2 py-1.5">
              <div className="flex justify-between font-bold tabular-nums"><span>฿</span><span>{money(doc.total)}</span></div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-3 flex items-center gap-3 text-[13px]">
        <span className="font-bold whitespace-nowrap">รวมเงิน / Total</span>
        <span className="flex-1 text-center">{numberToThaiBahtText(doc.total)}</span>
        <div className="w-[46mm] border-2 border-slate-900 px-2 py-1 font-bold tabular-nums flex justify-between"><span>฿</span><span>{money(doc.total)}</span></div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-[13px]">
        <div>
          <div className="flex items-end gap-2">
            <span className="font-bold">Approved</span>
            <span className="flex-1 border-b border-dotted border-slate-700 text-center h-7">{doc.approvedBy}</span>
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="font-bold">วันที่</span>
            <span className="flex-1 border-b border-slate-700 text-center">{dateSlash(doc.issuedAt)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-end gap-2"><span className="font-bold">{byLabel}</span><span className="flex-1 text-center">{PAY_LABEL[doc.payMethod]}</span></div>
          <div className="flex items-end gap-2"><span className="font-bold">เลขที่</span><span className="flex-1 border-b border-slate-700 text-center">{doc.payRefNo}</span><span className="font-bold">สาขา</span><span className="w-[30mm] border-b border-slate-700 text-center">{doc.branch}</span></div>
          <div className="flex items-end gap-2"><span className="font-bold">ธนาคาร</span><span className="flex-1 border-b border-slate-700 text-center">{doc.bankName}</span></div>
          <div className="flex items-end gap-2"><span className="font-bold">ชื่อบัญชี</span><span className="flex-1 border-b border-slate-700 text-center">{doc.accountName}</span></div>
        </div>
      </div>

      {doc.note && <p className="mt-5 text-[12px] text-slate-600">หมายเหตุ: {doc.note}</p>}
    </div>
  );
}
