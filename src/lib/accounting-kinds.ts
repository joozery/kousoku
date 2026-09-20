// ส่วนที่ไม่ผูกกับฐานข้อมูล — Client Component import ไฟล์นี้ได้ (อย่า import mongoose/mongodb ที่นี่)
export const ACCOUNTING_KINDS = ['withholding', 'payment_voucher', 'receipt_voucher'] as const;
export type AccountingKind = typeof ACCOUNTING_KINDS[number];

export const KIND_LABEL: Record<AccountingKind, string> = {
  withholding:     'หนังสือรับรองหัก ณ ที่จ่าย',
  payment_voucher: 'ใบสำคัญจ่าย',
  receipt_voucher: 'ใบสำคัญรับ',
};

// path หน้าสร้างเอกสารบัญชี: /admin/accounting/new/<slug>
export const KIND_SLUG: Record<AccountingKind, string> = {
  withholding:     'withholding',
  payment_voucher: 'payment-voucher',
  receipt_voucher: 'receipt-voucher',
};
export function kindFromSlug(slug: string): AccountingKind | null {
  return (Object.entries(KIND_SLUG).find(([, s]) => s === slug)?.[0] as AccountingKind | undefined) ?? null;
}

export type Party = { name: string; taxId: string; branch: string; address: string };
export type IncomeLine = { key: string; paidDate: string; paidAmount: number; tax: number; note: string };
export type PayMethod = 'cash' | 'transfer' | 'cheque';
export type FormType = '' | 'pnd1' | 'pnd1a' | 'pnd1a_special' | 'pnd3' | 'pnd2a' | 'pnd3a' | 'pnd53';
export type PayerCondition = 'withhold' | 'forever' | 'once' | 'other';

export type AccountingDocRow = {
  id: string;
  kind: AccountingKind;
  docNumber: string;
  bookNo: string;
  issuedAt: string; // ISO
  note: string;
  // ใบสำคัญ
  partyName: string;
  refDocNo: string;
  items: { description: string; amount: number }[];
  total: number;
  payMethod: PayMethod;
  payRefNo: string;
  branch: string;
  bankName: string;
  accountName: string;
  approvedBy: string;
  // 50 ทวิ
  payer: Party;
  payee: Party;
  formType: FormType;
  formSeq: string;
  incomeLines: IncomeLine[];
  totalPaid: number;
  totalTax: number;
  fundGpf: number;       // กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน
  fundSso: number;       // กองทุนประกันสังคม
  fundProvident: number; // กองทุนสำรองเลี้ยงชีพ
  payerCondition: PayerCondition;
  payerConditionOther: string;
};

// ข้อมูลที่ฟอร์มส่งมา (ยอดรวมทั้งหมดคำนวณฝั่ง server เสมอ)
export type AccountingDocInput = Omit<AccountingDocRow, 'id' | 'docNumber' | 'bookNo' | 'total' | 'totalPaid' | 'totalTax'>;

export function emptyAccountingInput(kind: AccountingKind, issuedAt: string): AccountingDocInput {
  const blankParty: Party = { name: '', taxId: '', branch: '', address: '' };
  return {
    kind, issuedAt, note: '',
    partyName: '', refDocNo: '', items: [{ description: '', amount: 0 }],
    payMethod: 'cash', payRefNo: '', branch: '', bankName: '', accountName: '', approvedBy: '',
    payer: { ...blankParty }, payee: { ...blankParty }, formType: '', formSeq: '', incomeLines: [],
    fundGpf: 0, fundSso: 0, fundProvident: 0,
    payerCondition: 'withhold', payerConditionOther: '',
  };
}
