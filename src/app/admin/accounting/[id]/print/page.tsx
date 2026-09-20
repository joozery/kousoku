import { notFound } from 'next/navigation';
import { getAccountingDocById, KIND_LABEL } from '@/lib/accounting-docs';
import { getDocumentSettings } from '@/lib/document-settings';
import { PrintPageShell } from '@/components/admin/documents/print-page-shell';
import { VoucherTemplate } from '@/components/admin/accounting/voucher-template';
import { WithholdingTemplate } from '@/components/admin/accounting/withholding-template';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const doc = await getAccountingDocById((await params).id);
  return { title: `${doc ? `${KIND_LABEL[doc.kind]} ${doc.docNumber}` : 'ตัวอย่างก่อนพิมพ์'} | Admin` };
}

export default async function AccountingPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [doc, seller] = await Promise.all([getAccountingDocById(id), getDocumentSettings()]);
  if (!doc) notFound();

  // 50 ทวิ พิมพ์ 2 ฉบับ (ฉบับแนบแบบแสดงรายการภาษี + ฉบับเก็บเป็นหลักฐาน)
  return (
    <PrintPageShell>
      {doc.kind === 'withholding'
        ? [1, 2].map(copy => <WithholdingTemplate key={copy} doc={doc} seller={seller} copy={copy as 1 | 2} />)
        : <VoucherTemplate doc={doc} seller={seller} />}
    </PrintPageShell>
  );
}
