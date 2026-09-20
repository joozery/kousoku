import type { FormType, PayerCondition } from './accounting-kinds';

// แถวของตาราง "ประเภทเงินได้พึงประเมินที่จ่าย" — ตามดีไซน์ public/withholding_tax_50bis_print.html
// lines = ข้อความในแบบพิมพ์ (indent: 0 ชิด, 1 เยื้อง, 2 เยื้องลึก) · short = ชื่อย่อในฟอร์มกรอก
export type WhtLine = { text: string; indent?: 0 | 1 | 2; bold?: boolean };
export type WhtRow = { key: string; short: string; lines: WhtLine[]; withNote?: boolean };

export const WHT_ROWS: WhtRow[] = [
  { key: '1', short: '1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40 (1)',
    lines: [{ text: '1. เงินเดือน ค่าจ้าง เบี้ยเลี้ยง โบนัส ฯลฯ ตามมาตรา 40 (1)' }] },
  { key: '2', short: '2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40 (2)',
    lines: [{ text: '2. ค่าธรรมเนียม ค่านายหน้า ฯลฯ ตามมาตรา 40 (2)' }] },
  { key: '3', short: '3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40 (3)',
    lines: [{ text: '3. ค่าแห่งลิขสิทธิ์ ฯลฯ ตามมาตรา 40 (3)' }] },
  { key: '4', short: '4. ดอกเบี้ย / เงินปันผล เงินส่วนแบ่งของกำไร ฯลฯ ตามมาตรา 40 (4)',
    lines: [
      { text: '4. (ก) ดอกเบี้ย ฯลฯ ตามมาตรา 40 (4)(ก)' },
      { text: '(ข) เงินปันผล เงินส่วนแบ่งของกำไร ฯลฯ ตามมาตรา 40 (4)(ข)', indent: 1 },
      { text: '(1) กรณีผู้ได้รับเงินเป็นผลได้จากบริษัทฯ', indent: 2 },
      { text: '(1.1) อัตราร้อยละ 30 ของกำไรสุทธิ', indent: 2 },
      { text: '(1.2) อัตราร้อยละ 25 ของกำไรสุทธิ', indent: 2 },
      { text: '(1.3) อัตราร้อยละ 20 ของกำไรสุทธิ', indent: 2 },
    ] },
  { key: '5', short: '5. การจ่ายเงินได้ที่ต้องหักภาษี ณ ที่จ่าย ตามคำสั่งกรมสรรพากร (ค่าจ้างทำของ ค่าโฆษณา ค่าเช่า ค่าขนส่ง ค่าบริการ ฯลฯ)',
    lines: [
      { text: '(5) การจ่ายเงินได้ที่ต้องหักภาษี ณ ที่จ่าย', bold: true },
      { text: 'ตามคำสั่งกรมสรรพากรที่ออกตามมาตรา 3 เตรส เช่น รางวัล ส่วนลดหรือประโยชน์ใด ๆ เนื่องจากการส่งเสริมการขาย รางวัลในการประกวด การแข่งขัน การชิงโชค ค่าตอบแทนของนักแสดงสาธารณะ ค่าจ้างทำของ ค่าโฆษณา ค่าเช่า ค่าขนส่ง ค่าบริการ ค่าเบี้ยประกันวินาศภัย ฯลฯ' },
    ] },
  { key: '6', short: '6. อื่น ๆ (ระบุ)', withNote: true,
    lines: [{ text: '6. อื่น ๆ (ระบุ)', bold: true }] },
];

// ลำดับที่ในแบบ (ตามดีไซน์)
export const FORM_TYPES: { value: Exclude<FormType, ''>; no: number; label: string }[] = [
  { value: 'pnd1', no: 1, label: 'ภ.ง.ด.1' },
  { value: 'pnd1a', no: 2, label: 'ภ.ง.ด.1ก' },
  { value: 'pnd1a_special', no: 3, label: 'ภ.ง.ด.1ก พิเศษ' },
  { value: 'pnd3', no: 4, label: 'ภ.ง.ด.3' },
  { value: 'pnd2a', no: 5, label: 'ภ.ง.ด.2ก' },
  { value: 'pnd3a', no: 6, label: 'ภ.ง.ด.3ก' },
  { value: 'pnd53', no: 7, label: 'ภ.ง.ด.53' },
];

export const PAYER_CONDITIONS: { value: PayerCondition; no: number; label: string }[] = [
  { value: 'withhold', no: 1, label: 'หัก ณ ที่จ่าย' },
  { value: 'forever', no: 2, label: 'ออกให้ตลอดไป' },
  { value: 'once', no: 3, label: 'ออกให้ครั้งเดียว' },
  { value: 'other', no: 4, label: 'อื่น ๆ (ระบุ)' },
];

// เลขประจำตัวผู้เสียภาษี → เลข 13 หลัก (ตัดขีด/ช่องว่าง) — ใช้แสดงในช่องทีละหลัก
export const taxIdDigits = (raw: string) => (raw ?? '').replace(/\D/g, '').slice(0, 13);

const p2 = (n: number) => String(n).padStart(2, '0');

// รับทั้ง 'YYYY-MM-DD' และ ISO เต็ม — ISO เต็มอ่านตามเวลาไทย
function ymd(v: string): { y: number; m: number; d: number } | null {
  if (!v) return null;
  const s = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : new Date(v).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const [y, m, d] = s.split('-').map(Number);
  return y ? { y, m, d } : null;
}
export const dateParts = (v: string) => ymd(v);
// dd/mm/yyyy (ปี ค.ศ. ตามดีไซน์)
export const dateDMY   = (v: string) => { const p = ymd(v); return p ? `${p2(p.d)}/${p2(p.m)}/${p.y}` : ''; };
// d/m/yyyy — ใช้กับใบสำคัญ
export const dateSlash = (v: string) => { const p = ymd(v); return p ? `${p.d}/${p.m}/${p.y}` : ''; };
