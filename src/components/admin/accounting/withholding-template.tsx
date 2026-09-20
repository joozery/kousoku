import { numberToThaiBahtText } from '@/lib/thai-baht-text';
import { WHT_ROWS, FORM_TYPES, PAYER_CONDITIONS, taxIdDigits, dateDMY, dateParts } from '@/lib/withholding-form';
import type { AccountingDocRow, Party } from '@/lib/accounting-docs';
import type { IDocumentSettings } from '@/models/DocumentSettings';

// ดีไซน์ตาม public/withholding_tax_50bis_print.html — ขนาดตัวอักษร/ระยะห่างตามต้นแบบ
// ต่างจากต้นแบบแค่: ช่องรายการที่ 5/6 สูงตามเนื้อหา (ไม่ fix 86 มม.) เพื่อให้พอดี A4 หนึ่งหน้าต่อฉบับ

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const box = 'border border-black';

function Check({ on }: { on: boolean }) {
  return (
    <span
      className="mr-[1mm] inline-flex h-[4.2mm] w-[4.2mm] shrink-0 items-center justify-center border border-black align-middle text-[11px] leading-none"
    >{on ? '✓' : ''}</span>
  );
}

function Option({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <span className="mr-[3mm] inline-flex items-center whitespace-nowrap"><Check on={on} />{children}</span>;
}

function FillLine({ children }: { children?: React.ReactNode }) {
  return <span className="min-h-[4.5mm] min-w-0 flex-1 border-b border-dotted border-black px-1 leading-[4.5mm]">{children}</span>;
}

function TaxIdBoxes({ value, large }: { value: string; large?: boolean }) {
  const d = taxIdDigits(value).padEnd(13, ' ').split('');
  return (
    <div className="inline-flex align-middle">
      {d.map((c, i) => (
        <span
          key={i}
          className="flex items-center justify-center border border-black text-[11px]"
          style={{ width: large ? '6mm' : '5.2mm', height: large ? '6.3mm' : '6mm', borderRight: i === 12 ? undefined : 0 }}
        >{c.trim()}</span>
      ))}
    </div>
  );
}

function PartyBox({ title, taxLabel, party, extra }: { title: string; taxLabel: string; party: Party; extra?: React.ReactNode }) {
  return (
    <section className={`${box} px-[2mm] py-[1.8mm]`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-[3mm]">
        <div className="flex min-h-[5.5mm] items-baseline gap-[2mm]">
          <span className="whitespace-nowrap font-bold">{title} :</span>
          <FillLine>{party.branch}</FillLine>
        </div>
        <div className="mt-[1mm] flex items-center gap-[2mm]">
          <span className="whitespace-nowrap font-bold">{taxLabel}</span>
          <TaxIdBoxes value={party.taxId} />
        </div>
      </div>
      <div className="flex min-h-[5.5mm] items-baseline gap-[2mm]"><span className="whitespace-nowrap font-bold">ชื่อ</span><FillLine>{party.name}</FillLine></div>
      <div className="flex min-h-[5.5mm] items-baseline gap-[2mm]"><span className="whitespace-nowrap font-bold">ที่อยู่</span><FillLine>{party.address}</FillLine></div>
      {extra}
    </section>
  );
}

const INDENT = { 0: 0, 1: '4mm', 2: '8mm' } as const;

// หนึ่งฉบับของหนังสือรับรอง — copy = 1 (แนบแบบแสดงรายการภาษี) หรือ 2 (เก็บเป็นหลักฐาน)
export function WithholdingTemplate({ doc, seller, copy }: { doc: AccountingDocRow; seller: IDocumentSettings; copy: 1 | 2 }) {
  const lineByKey = new Map(doc.incomeLines.map(l => [l.key, l]));
  const d = dateParts(doc.issuedAt);
  // ความสูงขั้นต่ำของแถว (เผื่อที่ว่างสำหรับเขียนมือ) ตามสัดส่วนของต้นแบบ
  const minH: Record<string, string> = { '5': '34mm', '6': '15mm' };

  return (
    <div
      id="print-document"
      style={{ width: '210mm', minHeight: '296mm', background: 'white', padding: '8mm' }}
      className="text-[12px] leading-[1.3] text-black"
    >
      <div className="mb-[1mm] text-[10px] leading-[1.15]">
        <b>ฉบับที่ 1</b>&nbsp;&nbsp; (สำหรับผู้ถูกหักภาษี ณ ที่จ่าย ใช้แนบพร้อมกับแบบแสดงรายการภาษี){copy === 1 ? ' ◄' : ''}
        <br />
        <b>ฉบับที่ 2</b>&nbsp;&nbsp; (สำหรับผู้ถูกหักภาษี ณ ที่จ่าย เก็บไว้เป็นหลักฐาน){copy === 2 ? ' ◄' : ''}
      </div>

      <header className="relative pb-[1mm] text-center">
        <div className="absolute right-0 top-0 w-[40mm] text-left text-[11px] leading-[1.35]">
          เล่มที่ <span className="inline-block min-w-[23mm] border-b border-dotted border-black text-center align-bottom">{doc.bookNo}</span>
          <br />
          เลขที่ <b>{doc.docNumber}</b>
        </div>
        <h1 className="text-[19px] font-bold leading-[1.05]">หนังสือรับรองการหักภาษี ณ ที่จ่าย</h1>
        <h2 className="mt-px text-[13px] font-normal leading-none">ตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร</h2>
      </header>

      <div className="space-y-[1.5mm]">
        <PartyBox title="ผู้มีหน้าที่หักภาษี ณ ที่จ่าย" taxLabel="เลขประจำตัวผู้เสียภาษีอากร (13 หลัก)*" party={doc.payer} />
        <PartyBox
          title="ผู้ถูกหักภาษี ณ ที่จ่าย" taxLabel="เลขประจำตัวผู้เสียภาษีอากร" party={doc.payee}
          extra={
            <div className="mt-[1.2mm] leading-[5mm]">
              <span className="font-bold">ลำดับที่</span>
              {doc.formSeq ? <span className="mx-1 inline-block min-w-[10mm] border-b border-dotted border-black text-center">{doc.formSeq}</span> : null}{' '}
              {FORM_TYPES.slice(0, 4).map(f => <Option key={f.value} on={doc.formType === f.value}>({f.no}) {f.label}</Option>)}
              <br />
              {FORM_TYPES.slice(4).map(f => <Option key={f.value} on={doc.formType === f.value}>({f.no}) {f.label}</Option>)}
            </div>
          }
        />
      </div>

      {/* ตารางรายการเงินได้ */}
      <table className="mt-[1.5mm] w-full border-collapse text-[10.8px]" style={{ tableLayout: 'fixed' }}>
        <colgroup><col style={{ width: '54%' }} /><col style={{ width: '15%' }} /><col style={{ width: '16%' }} /><col style={{ width: '15%' }} /></colgroup>
        <thead>
          <tr className="[&>th]:border [&>th]:border-black [&>th]:px-[1.3mm] [&>th]:py-[1.1mm] [&>th]:text-center [&>th]:font-bold [&>th]:leading-[1.05]">
            <th>ประเภทเงินได้พึงประเมินที่จ่าย</th>
            <th>วัน เดือน<br />หรือปีภาษีที่จ่าย</th>
            <th>จำนวนเงินที่จ่าย</th>
            <th>ภาษีที่หัก<br />และนำส่งไว้</th>
          </tr>
        </thead>
        <tbody className="[&_td]:border [&_td]:border-black [&_td]:px-[1.3mm] [&_td]:py-[1.1mm] [&_td]:align-top">
          {WHT_ROWS.map(row => {
            const line = lineByKey.get(row.key);
            const bottom = row.key === '5' || row.key === '6' ? { verticalAlign: 'bottom' as const } : undefined;
            return (
              <tr key={row.key} style={{ height: minH[row.key] }}>
                <td>
                  <div className="leading-[1.15]">
                    {row.lines.map((l, i) => (
                      <div key={i} style={{ paddingLeft: INDENT[l.indent ?? 0] }}>
                        {l.bold ? <b>{l.text}</b> : l.text}
                        {row.withNote && i === 0 ? <span className="ml-1">{line?.note ? <u>{line.note}</u> : '..............................................................'}</span> : null}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="text-center tabular-nums" style={bottom}>{line?.paidDate ? dateDMY(line.paidDate) : ''}</td>
                <td className="whitespace-nowrap text-right tabular-nums" style={bottom}>{line && line.paidAmount ? money(line.paidAmount) : ''}</td>
                <td className="whitespace-nowrap text-right tabular-nums" style={bottom}>{line && (line.tax || line.paidAmount) ? money(line.tax) : ''}</td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={2} className="text-right font-bold" style={{ verticalAlign: 'middle' }}>รวมเงินที่จ่ายและภาษีที่หักนำส่ง</td>
            <td className="whitespace-nowrap text-right tabular-nums"><b>{money(doc.totalPaid)}</b></td>
            <td className="whitespace-nowrap text-right tabular-nums"><b>{money(doc.totalTax)}</b></td>
          </tr>
          <tr>
            <td colSpan={4}>
              รวมเงินภาษีที่หักนำส่ง (ตัวอักษร){' '}
              <span className="inline-block w-[105mm] border-b border-dotted border-black text-center align-bottom">{numberToThaiBahtText(doc.totalTax)}</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ผู้จ่ายเงิน */}
      <section className={`${box} mt-[1.5mm] px-[2mm] py-[1.8mm]`}>
        <div className="flex flex-wrap items-center gap-x-[4mm]">
          <b>ผู้จ่ายเงิน</b>
          {PAYER_CONDITIONS.map(c => (
            <Option key={c.value} on={doc.payerCondition === c.value}>
              ({c.no}) {c.label}
              {c.value === 'other' && (doc.payerCondition === 'other' && doc.payerConditionOther ? <u className="ml-1">{doc.payerConditionOther}</u> : <span className="ml-1">........................</span>)}
            </Option>
          ))}
        </div>
      </section>

      {/* เงินสมทบ */}
      <section className={`${box} mt-[1.5mm] px-[2mm] py-[1.8mm]`}>
        เงินที่จ่ายเข้า&nbsp;&nbsp;
        กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน<span className="mx-1 inline-block min-w-[22mm] border-b border-dotted border-black text-right align-bottom tabular-nums">{doc.fundGpf ? money(doc.fundGpf) : ''}</span>บาท&nbsp;&nbsp;
        กองทุนประกันสังคม<span className="mx-1 inline-block min-w-[22mm] border-b border-dotted border-black text-right align-bottom tabular-nums">{doc.fundSso ? money(doc.fundSso) : ''}</span>บาท&nbsp;&nbsp;
        กองทุนสำรองเลี้ยงชีพ<span className="mx-1 inline-block min-w-[22mm] border-b border-dotted border-black text-right align-bottom tabular-nums">{doc.fundProvident ? money(doc.fundProvident) : ''}</span>บาท
      </section>

      {/* คำเตือน / ลงชื่อ */}
      <section className={`${box} mt-[1.5mm] grid min-h-[34mm] grid-cols-[27%_73%]`}>
        <div className="border-r border-black p-[2mm] text-[10.5px] leading-[1.2]">
          <div className="mb-[1mm] font-bold">คำเตือน</div>
          ผู้มีหน้าที่ออกหนังสือรับรองการหักภาษี ณ ที่จ่าย ฝ่าฝืนไม่ปฏิบัติตามมาตรา 50 ทวิ แห่งประมวลรัษฎากร ต้องรับโทษทางอาญาตามมาตรา 35 แห่งประมวลรัษฎากร
        </div>
        <div className="px-[3mm] py-[2mm] text-center text-[10.5px]">
          <div className="relative min-h-[29mm]">
            ขอรับรองว่าข้อความและตัวเลขดังกล่าวข้างต้น ถูกต้องตรงกับความจริงทุกประการ
            <div className="mx-auto mb-[1mm] mt-[7mm] flex h-[4mm] w-3/4 items-end justify-center border-b border-dotted border-black">
              {seller.issuerSignatureUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={seller.issuerSignatureUrl} alt="" className="h-[9mm] w-auto object-contain" />
              ) : null}
            </div>
            ลงชื่อ ............................................................... ผู้จ่ายเงิน
            <div className="mt-[2mm]">
              วันที่ <u>&nbsp;{d ? String(d.d).padStart(2, '0') : '......'}&nbsp;</u> / <u>&nbsp;{d ? String(d.m).padStart(2, '0') : '......'}&nbsp;</u> / <u>&nbsp;{d ? d.y : '......'}&nbsp;</u>
            </div>
            <div className="absolute bottom-[7mm] right-[7mm] flex h-[14mm] w-[14mm] items-center justify-center overflow-hidden rounded-full border border-black text-[6px] leading-none">
              {seller.stampUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={seller.stampUrl} alt="" className="h-full w-full object-contain" />
              ) : <span>ประทับตรา<br />นิติบุคคล<br />(ถ้ามี)</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-[1.5mm] text-[8.8px] leading-[1.15]">
        <b className="text-[9px]">หมายเหตุ</b>&nbsp;&nbsp;เลขประจำตัวผู้เสียภาษีอากร (13 หลัก)* หมายถึง
        <br />&nbsp;&nbsp;1. กรณีบุคคลธรรมดา ให้ใช้เลขประจำตัวประชาชนของกรมการปกครอง
        <br />&nbsp;&nbsp;2. กรณีนิติบุคคล ให้ใช้เลขทะเบียนนิติบุคคลของกรมพัฒนาธุรกิจการค้า
        <br />&nbsp;&nbsp;3. กรณีอื่น ๆ นอกเหนือจาก 1 และ 2 ให้ใช้เลขประจำตัวผู้เสียภาษีอากร (13 หลัก) ของกรมสรรพากร
      </div>
    </div>
  );
}
