import { Schema, model, models } from 'mongoose';

// เอกสารบัญชี 3 ชนิด (แยกจาก FinancialDocument — ไม่กระทบตัวเลขรายรับ/รายจ่ายในระบบ)
//  - withholding      หนังสือรับรองการหักภาษี ณ ที่จ่าย (50 ทวิ)
//  - payment_voucher  ใบสำคัญจ่าย
//  - receipt_voucher  ใบสำคัญรับ
import { ACCOUNTING_KINDS } from '@/lib/accounting-kinds';
export { ACCOUNTING_KINDS };

const partySchema = new Schema({
  name:    { type: String, default: '' },
  taxId:   { type: String, default: '' },
  branch:  { type: String, default: '' },
  address: { type: String, default: '' },
}, { _id: false });

const voucherItemSchema = new Schema({
  description: { type: String, default: '' },
  amount:      { type: Number, default: 0 },
}, { _id: false });

// 1 แถวของตาราง "ประเภทเงินได้พึงประเมินที่จ่าย" ในแบบ 50 ทวิ — key = หัวข้อในแบบ (1,2,3,4a,4b_1_1 … 5,6)
const incomeLineSchema = new Schema({
  key:        { type: String, required: true },
  paidDate:   { type: String, default: '' }, // YYYY-MM-DD
  paidAmount: { type: Number, default: 0 },
  tax:        { type: Number, default: 0 },
  note:       { type: String, default: '' }, // ข้อความระบุ (อัตราอื่น ๆ / อื่น ๆ)
}, { _id: false });

const accountingDocSchema = new Schema({
  kind:      { type: String, enum: ACCOUNTING_KINDS, required: true },
  docNumber: { type: String, required: true, unique: true },
  bookNo:    { type: String, default: '' }, // เล่มที่ (เฉพาะ 50 ทวิ)
  issuedAt:  { type: Date, required: true },
  note:      { type: String, default: '' },

  // ── ใบสำคัญรับ/จ่าย ─────────────────────────
  partyName:   { type: String, default: '' }, // จ่ายให้ / รับจาก
  refDocNo:    { type: String, default: '' }, // ใบกำกับเลขที่ / อ้างอิง
  items:       { type: [voucherItemSchema], default: [] },
  total:       { type: Number, default: 0 },
  payMethod:   { type: String, enum: ['cash', 'transfer', 'cheque'], default: 'cash' },
  payRefNo:    { type: String, default: '' }, // เลขที่เช็ค / เลขที่รายการโอน
  branch:      { type: String, default: '' },
  bankName:    { type: String, default: '' },
  accountName: { type: String, default: '' },
  approvedBy:  { type: String, default: '' },

  // ── 50 ทวิ ─────────────────────────────────
  payer:      { type: partySchema, default: () => ({}) }, // ผู้มีหน้าที่หักภาษี ณ ที่จ่าย
  payee:      { type: partySchema, default: () => ({}) }, // ผู้ถูกหักภาษี ณ ที่จ่าย
  formType:   { type: String, enum: ['', 'pnd1', 'pnd1a', 'pnd1a_special', 'pnd3', 'pnd2a', 'pnd3a', 'pnd53'], default: '' },
  formSeq:    { type: String, default: '' }, // ลำดับที่ในแบบ
  incomeLines: { type: [incomeLineSchema], default: [] },
  totalPaid:  { type: Number, default: 0 },
  totalTax:   { type: Number, default: 0 },
  fundGpf:           { type: Number, default: 0 },  // กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน
  fundSso:           { type: Number, default: 0 },  // กองทุนประกันสังคม
  fundProvident:     { type: Number, default: 0 },  // กองทุนสำรองเลี้ยงชีพ
  payerCondition:      { type: String, enum: ['withhold', 'forever', 'once', 'other'], default: 'withhold' },
  payerConditionOther: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now },
}, { collection: 'accountingdocs' });

accountingDocSchema.index({ kind: 1, issuedAt: -1 });

// โหมดพัฒนา: ลงทะเบียนโมเดลใหม่ทุกครั้งที่ไฟล์นี้ถูกโหลด — ไม่งั้น hot reload จะใช้ schema เก่าที่ค้างอยู่ แล้วฟิลด์ใหม่ถูกทิ้งตอนบันทึก
if (process.env.NODE_ENV !== 'production') delete models.AccountingDoc;
export const AccountingDoc = models.AccountingDoc || model('AccountingDoc', accountingDocSchema);
