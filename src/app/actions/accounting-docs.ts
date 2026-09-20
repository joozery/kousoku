'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { AccountingDoc } from '@/models/AccountingDoc';
import { generateAccountingNumber, type AccountingDocInput } from '@/lib/accounting-docs';

type Result = { ok: true; id: string } | { ok: false; error: string };

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const digits = (s: string) => (s ?? '').replace(/\D/g, '');

// ตรวจข้อมูล + คำนวณยอดรวม → คืนข้อมูลพร้อมบันทึก หรือข้อความ error
function prepare(input: AccountingDocInput): { data: Record<string, unknown> } | { error: string } {
  const issuedAt = new Date(`${input.issuedAt}T12:00:00`);
  if (!input.issuedAt || Number.isNaN(issuedAt.getTime())) return { error: 'กรุณาเลือกวันที่' };

  if (input.kind === 'withholding') {
    if (!input.payer.name.trim()) return { error: 'กรุณากรอกชื่อผู้มีหน้าที่หักภาษี ณ ที่จ่าย' };
    if (!input.payee.name.trim()) return { error: 'กรุณากรอกชื่อผู้ถูกหักภาษี ณ ที่จ่าย' };
    for (const [label, tax] of [['ผู้มีหน้าที่หักภาษี', input.payer.taxId], ['ผู้ถูกหักภาษี', input.payee.taxId]] as const) {
      if (tax.trim() && digits(tax).length !== 13) return { error: `เลขประจำตัวผู้เสียภาษีของ${label}ต้องมี 13 หลัก` };
    }
    const lines = input.incomeLines
      .filter(l => l.paidAmount > 0 || l.tax > 0)
      .map(l => ({ key: l.key, paidDate: l.paidDate, paidAmount: round2(l.paidAmount), tax: round2(l.tax), note: l.note.trim() }));
    if (lines.length === 0) return { error: 'กรุณากรอกรายการเงินได้ที่จ่ายอย่างน้อย 1 รายการ' };
    if (lines.some(l => l.paidAmount < 0 || l.tax < 0 || l.tax > l.paidAmount)) return { error: 'ภาษีที่หักต้องไม่เกินจำนวนเงินที่จ่าย' };
    return {
      data: {
        kind: input.kind, issuedAt, note: input.note.trim(),
        payer: { ...input.payer, taxId: digits(input.payer.taxId) },
        payee: { ...input.payee, taxId: digits(input.payee.taxId) },
        formType: input.formType, formSeq: input.formSeq.trim(), incomeLines: lines,
        totalPaid: round2(lines.reduce((s, l) => s + l.paidAmount, 0)),
        totalTax:  round2(lines.reduce((s, l) => s + l.tax, 0)),
        fundGpf: Math.max(0, input.fundGpf || 0), fundSso: Math.max(0, input.fundSso || 0), fundProvident: Math.max(0, input.fundProvident || 0),
        payerCondition: input.payerCondition, payerConditionOther: input.payerConditionOther.trim(),
      },
    };
  }

  // ใบสำคัญรับ / จ่าย
  if (!input.partyName.trim()) return { error: input.kind === 'payment_voucher' ? 'กรุณากรอกชื่อผู้รับเงิน (จ่ายให้)' : 'กรุณากรอกชื่อผู้จ่ายเงิน (รับจาก)' };
  const items = input.items
    .filter(i => i.description.trim() || i.amount > 0)
    .map(i => ({ description: i.description.trim(), amount: round2(i.amount) }));
  if (items.length === 0) return { error: 'กรุณากรอกรายการอย่างน้อย 1 รายการ' };
  if (items.some(i => !i.description || !(i.amount > 0))) return { error: 'ทุกรายการต้องมีคำอธิบายและจำนวนเงินมากกว่า 0' };
  return {
    data: {
      kind: input.kind, issuedAt, note: input.note.trim(),
      partyName: input.partyName.trim(), refDocNo: input.refDocNo.trim(), items,
      total: round2(items.reduce((s, i) => s + i.amount, 0)),
      payMethod: input.payMethod, payRefNo: input.payRefNo.trim(), branch: input.branch.trim(),
      bankName: input.bankName.trim(), accountName: input.accountName.trim(), approvedBy: input.approvedBy.trim(),
    },
  };
}

export async function createAccountingDoc(input: AccountingDocInput): Promise<Result> {
  const prepared = prepare(input);
  if ('error' in prepared) return { ok: false, error: prepared.error };
  try {
    await connectDB();
    const issuedAt = prepared.data.issuedAt as Date;
    // เลขที่ออกจากเลขล่าสุดของเดือน — ชนกัน (บันทึกพร้อมกัน) ให้ลองใหม่
    for (let attempt = 0; attempt < 3; attempt++) {
      const { docNumber, bookNo } = await generateAccountingNumber(input.kind, issuedAt);
      try {
        const doc = await AccountingDoc.create({ ...prepared.data, docNumber, bookNo });
        revalidatePath('/admin/accounting');
        return { ok: true, id: String(doc._id) };
      } catch (err) {
        if ((err as { code?: number }).code !== 11000) throw err;
      }
    }
    return { ok: false, error: 'ออกเลขที่เอกสารไม่สำเร็จ กรุณาลองใหม่' };
  } catch (err) {
    console.error('[createAccountingDoc]', err);
    return { ok: false, error: 'บันทึกเอกสารไม่สำเร็จ' };
  }
}

export async function updateAccountingDoc(id: string, input: AccountingDocInput): Promise<Result> {
  const prepared = prepare(input);
  if ('error' in prepared) return { ok: false, error: prepared.error };
  try {
    await connectDB();
    // ไม่เปลี่ยนชนิดเอกสารและเลขที่เดิม
    const { kind: _kind, ...rest } = prepared.data;
    void _kind;
    const doc = await AccountingDoc.findOneAndUpdate({ _id: id, kind: input.kind }, { $set: rest }, { new: true });
    if (!doc) return { ok: false, error: 'ไม่พบเอกสาร' };
    revalidatePath('/admin/accounting');
    revalidatePath(`/admin/accounting/${id}/print`);
    return { ok: true, id };
  } catch (err) {
    console.error('[updateAccountingDoc]', err);
    return { ok: false, error: 'แก้ไขเอกสารไม่สำเร็จ' };
  }
}

export async function deleteAccountingDoc(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await connectDB();
    await AccountingDoc.findByIdAndDelete(id);
    revalidatePath('/admin/accounting');
    return { ok: true };
  } catch (err) {
    console.error('[deleteAccountingDoc]', err);
    return { ok: false, error: 'ลบเอกสารไม่สำเร็จ' };
  }
}
