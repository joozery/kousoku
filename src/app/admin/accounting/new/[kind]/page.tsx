import { notFound } from 'next/navigation';
import { kindFromSlug, KIND_LABEL, emptyAccountingInput } from '@/lib/accounting-docs';
import { getDocumentSettings } from '@/lib/document-settings';
import { AccountingDocForm } from '@/components/admin/accounting/accounting-doc-form';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ kind: string }> }) {
  const kind = kindFromSlug((await params).kind);
  return { title: `สร้าง${kind ? KIND_LABEL[kind] : 'เอกสารบัญชี'} | Admin` };
}

export default async function NewAccountingDocPage({ params }: { params: Promise<{ kind: string }> }) {
  const kind = kindFromSlug((await params).kind);
  if (!kind) notFound();

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const initial = emptyAccountingInput(kind, today);

  // 50 ทวิ: ผู้หักภาษี ณ ที่จ่าย = บริษัทของเรา (ดึงจากตั้งค่าหัวกระดาษเอกสาร)
  if (kind === 'withholding') {
    const s = await getDocumentSettings();
    initial.payer = { name: s.companyName, taxId: s.taxId, branch: 'สำนักงานใหญ่', address: s.address };
  }

  return <AccountingDocForm kind={kind} initial={initial} />;
}
