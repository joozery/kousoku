import { notFound } from 'next/navigation';
import { getAccountingDocById, KIND_LABEL, type AccountingDocInput } from '@/lib/accounting-docs';
import { AccountingDocForm } from '@/components/admin/accounting/accounting-doc-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'แก้ไขเอกสารบัญชี | Admin' };

export default async function EditAccountingDocPage({ params }: { params: Promise<{ id: string }> }) {
  const doc = await getAccountingDocById((await params).id);
  if (!doc) notFound();

  const { id, docNumber, bookNo, total, totalPaid, totalTax, ...rest } = doc;
  void bookNo; void total; void totalPaid; void totalTax;
  const initial: AccountingDocInput = { ...rest, issuedAt: new Date(doc.issuedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' }) };

  return <AccountingDocForm kind={doc.kind} initial={initial} docId={id} docNumber={`${docNumber} · ${KIND_LABEL[doc.kind]}`} />;
}
