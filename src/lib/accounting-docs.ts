import connectDB from './mongodb';
import { AccountingDoc } from '@/models/AccountingDoc';
import type { AccountingKind, AccountingDocRow, Party } from './accounting-kinds';

export * from './accounting-kinds';

const party = (p: Partial<Party> | undefined): Party => ({
  name: p?.name ?? '', taxId: p?.taxId ?? '', branch: p?.branch ?? '', address: p?.address ?? '',
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(d: any): AccountingDocRow {
  return {
    id: String(d._id),
    kind: d.kind,
    docNumber: d.docNumber,
    bookNo: d.bookNo ?? '',
    issuedAt: d.issuedAt instanceof Date ? d.issuedAt.toISOString() : String(d.issuedAt),
    note: d.note ?? '',
    partyName: d.partyName ?? '',
    refDocNo: d.refDocNo ?? '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: (d.items ?? []).map((i: any) => ({ description: i.description ?? '', amount: i.amount ?? 0 })),
    total: d.total ?? 0,
    payMethod: d.payMethod ?? 'cash',
    payRefNo: d.payRefNo ?? '',
    branch: d.branch ?? '',
    bankName: d.bankName ?? '',
    accountName: d.accountName ?? '',
    approvedBy: d.approvedBy ?? '',
    payer: party(d.payer),
    payee: party(d.payee),
    formType: d.formType ?? '',
    formSeq: d.formSeq ?? '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    incomeLines: (d.incomeLines ?? []).map((l: any) => ({
      key: l.key, paidDate: l.paidDate ?? '', paidAmount: l.paidAmount ?? 0, tax: l.tax ?? 0, note: l.note ?? '',
    })),
    totalPaid: d.totalPaid ?? 0,
    totalTax: d.totalTax ?? 0,
    fundGpf: d.fundGpf ?? 0,
    fundSso: d.fundSso ?? 0,
    fundProvident: d.fundProvident ?? 0,
    payerCondition: d.payerCondition ?? 'withhold',
    payerConditionOther: d.payerConditionOther ?? '',
  };
}

export async function getAccountingDocs(kind?: AccountingKind): Promise<AccountingDocRow[]> {
  await connectDB();
  const docs = await AccountingDoc.find(kind ? { kind } : {}).sort({ issuedAt: -1, docNumber: -1 }).lean();
  return docs.map(normalize);
}

export async function getAccountingDocById(id: string): Promise<AccountingDocRow | null> {
  if (!/^[a-f\d]{24}$/i.test(id)) return null;
  await connectDB();
  const doc = await AccountingDoc.findById(id).lean();
  return doc ? normalize(doc) : null;
}

// เลขที่เอกสาร รีเซ็ตทุกเดือน:
//  ใบสำคัญจ่าย  KSK{yy}{mm}{nnn}   เช่น KSK2601027 (ปี ค.ศ. 2 หลัก)
//  ใบสำคัญรับ   KSKR{yy}{mm}{nnn}
//  50 ทวิ       {yy}{mm}{nnn}      เช่น 6908003 (ปี พ.ศ. 2 หลัก) และเล่มที่ = ปี พ.ศ. เช่น 2569
export async function generateAccountingNumber(kind: AccountingKind, issuedAt: Date): Promise<{ docNumber: string; bookNo: string }> {
  await connectDB();
  const ce = issuedAt.getFullYear();
  const be = ce + 543;
  const mm = String(issuedAt.getMonth() + 1).padStart(2, '0');
  const prefix =
    kind === 'payment_voucher' ? `KSK${String(ce).slice(-2)}${mm}` :
    kind === 'receipt_voucher' ? `KSKR${String(ce).slice(-2)}${mm}` :
    `${String(be).slice(-2)}${mm}`;
  const pattern = new RegExp(`^${prefix}\\d{3}$`);
  const last = await AccountingDoc.findOne({ kind, docNumber: pattern }).sort({ docNumber: -1 }).lean() as { docNumber: string } | null;
  const seq = last ? parseInt(last.docNumber.slice(prefix.length), 10) + 1 : 1;
  return { docNumber: `${prefix}${String(seq).padStart(3, '0')}`, bookNo: kind === 'withholding' ? String(be) : '' };
}

