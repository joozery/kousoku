import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import QRCode from 'qrcode';
import { getDocumentById, DOC_TYPE_COLOR } from '@/lib/documents';
import { getDocumentSettings } from '@/lib/document-settings';
import { PrintPageShell } from '@/components/admin/documents/print-page-shell';
import { DocumentTemplate, type DocumentTemplateProps } from '@/components/admin/documents/document-template';
import { PaymentInfoPage } from '@/components/admin/documents/payment-info-page';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'ตัวอย่างก่อนพิมพ์ | Admin' };

const DOC_TYPE_PRINT_LABEL: Record<string, string> = {
  invoice:      'ใบเสร็จรับเงิน/ใบกำกับภาษี',
  quote:        'ใบเสนอราคา',
  credit_note:  'ใบลดหนี้',
  billing_note: 'ใบแจ้งหนี้',
  payment_note: 'ใบรับชำระ',
  booking_note: 'ใบจอง',
};

// ใบเสร็จที่ไม่มี VAT ใช้ชื่อ "ใบเสร็จรับเงิน" เฉยๆ — มี VAT ถึงจะนับเป็นใบกำกับภาษีได้ด้วย
function docTypePrintLabel(type: string, vatRate: number): string {
  if (type === 'invoice' && vatRate <= 0) return 'ใบเสร็จรับเงิน';
  return DOC_TYPE_PRINT_LABEL[type] ?? type;
}

// ใบเสร็จ/ใบกำกับภาษี (INV) ออกเป็นชุด 6 ใบ: ใบกำกับภาษี/ใบส่งสินค้า (ต้นฉบับ+สำเนา) → ใบแจ้งหนี้ → ใบส่งสินค้า (สำเนา) → ใบเสร็จรับเงิน (ต้นฉบับ+สำเนา)
const INVOICE_SET: { label: string; copy: string }[] = [
  { label: 'ใบกำกับภาษี/ใบส่งสินค้า',       copy: '(ต้นฉบับ)' },
  { label: 'ใบกำกับภาษี/ใบส่งสินค้า',       copy: '(สำเนา)' },
  { label: 'ใบแจ้งหนี้/สำเนาใบส่งสินค้า',   copy: '' },
  { label: 'ใบส่งสินค้า',                    copy: '(สำเนา)' },
  { label: 'ใบเสร็จรับเงิน',                 copy: '(ต้นฉบับ)' },
  { label: 'ใบเสร็จรับเงิน',                 copy: '(สำเนา)' },
];

const PAYMENT_LABEL: Record<string, string> = {
  cash:        'เงินสด',
  transfer:    'โอนเงิน',
  credit_card: 'บัตรเครดิต',
  pending:     'รอชำระ',
};

function fmtDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default async function DocumentPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ copies?: string }>;
}) {
  const { id } = await params;
  const { copies } = await searchParams;
  const [doc, settings, hdrs] = await Promise.all([
    getDocumentById(id),
    getDocumentSettings(),
    headers(),
  ]);

  if (!doc) notFound();

  const host = hdrs.get('host') ?? 'localhost:3000';
  const proto = host.startsWith('localhost') ? 'http' : 'https';
  const publicUrl = `${proto}://${host}/doc/${id}`;
  const qrCodeUrl = await QRCode.toDataURL(publicUrl, { width: 256, margin: 1 });

  const templateProps: DocumentTemplateProps = {
    docTypeLabel: docTypePrintLabel(doc.type, doc.vatRate),
    docNumber: doc.docNumber,
    issueDate: fmtDate(doc.issuedAt),
    reference: doc.relatedDocNumber || doc.bookingRef || undefined,
    seller: settings,
    customer: {
      name: doc.customerName,
      phone: doc.customerPhone || undefined,
      email: doc.customerEmail || undefined,
      lineId: doc.customerLineId || undefined,
      note: doc.customerCar || undefined,
      address: doc.customerAddress || undefined,
      taxId: doc.customerTaxId || undefined,
      branch: doc.customerBranch || undefined,
    },
    items: doc.items.map((item) => ({
      description:     item.description,
      qty:             item.qty,
      unitPrice:       item.unitPrice,
      discountPercent: item.discount,
      discountType:    (item.discountType as 'pct' | 'amt') ?? 'pct',
      lineTotal:       item.lineTotal,
    })),
    vatRate: doc.vatRate,
    vatBase: doc.grandTotal - doc.vatAmount,
    vatAmount: doc.vatAmount,
    grandTotal: doc.grandTotal,
    subtotal: doc.subtotal,
    discountTotal: doc.discountTotal,
    // มัดจำแสดงทุกชนิดเอกสารที่มีค่า — ใบเสนอราคา/ใบเสร็จที่ต่อยอดจากใบจองต้องเห็นยอดคงเหลือด้วย
    depositAmount: doc.depositAmount ?? 0,
    withholding: doc.withholdingAmount ?? 0,
    paidAmount: doc.grandTotal - (doc.withholdingAmount ?? 0),
    accentColor: DOC_TYPE_COLOR[doc.type],
    payment: doc.paymentMethod !== 'pending' ? { method: PAYMENT_LABEL[doc.paymentMethod], date: fmtDate(doc.issuedAt) } : undefined,
    notes: doc.note ? [doc.note] : [],
    footerNote: undefined,
    technicianName: doc.technicianName || undefined,
    qrCodeUrl,
  };

  // ใบเสร็จที่มี VAT พิมพ์เป็นชุด 6 ใบโดยอัตโนมัติ (เลือกพิมพ์ใบเดียวได้ด้วย ?copies=single)
  const isInvoiceSet = doc.type === 'invoice' && doc.vatRate > 0;
  const printSet = isInvoiceSet && copies !== 'single';

  const toolbarExtra = isInvoiceSet ? (
    <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
      <Link
        href={`/admin/documents/${id}/print`}
        className={`px-3 py-1.5 text-xs font-bold transition-colors ${printSet ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
      >
        ชุด 6 ใบ
      </Link>
      <Link
        href={`/admin/documents/${id}/print?copies=single`}
        className={`px-3 py-1.5 text-xs font-bold transition-colors ${!printSet ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
      >
        ใบเดียว
      </Link>
    </div>
  ) : undefined;

  return (
    <PrintPageShell toolbarExtra={toolbarExtra}>
      {printSet ? (
        INVOICE_SET.map((page, i) => (
          <DocumentTemplate key={i} {...templateProps} docTypeLabel={page.label} copyLabel={page.copy} />
        ))
      ) : (
        <DocumentTemplate {...templateProps} />
      )}
      {doc.showPaymentInfo && (
        <PaymentInfoPage
          settings={settings}
          docNumber={doc.docNumber}
          docTypeLabel={templateProps.docTypeLabel}
          grandTotal={doc.grandTotal}
        />
      )}
    </PrintPageShell>
  );
}
