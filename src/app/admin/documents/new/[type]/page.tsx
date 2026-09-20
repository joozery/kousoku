import { getCustomers, mergeCustomerSources } from '@/lib/customers';
import { getCustomerDirectory } from '@/lib/customer-directory';
import { getAllProductsAdmin } from '@/lib/products';
import { getServiceItems } from '@/lib/service-items';
import { getDocumentById } from '@/lib/documents';
import type { DocType } from '@/lib/documents';
import { getActiveEmployees } from '@/lib/employees';
import { docTypeFromSlug } from '@/lib/doc-routes';
import { notFound } from 'next/navigation';
import { NewDocumentClient, type DocPrefill } from '@/components/admin/new-document-client';

export const dynamic = 'force-dynamic';

const TYPE_LABEL: Record<DocType, string> = {
  invoice:      'ใบเสร็จ / ใบกำกับภาษี',
  quote:        'ใบเสนอราคา',
  credit_note:  'ใบลดหนี้',
  billing_note: 'ใบแจ้งหนี้',
  payment_note: 'ใบรับชำระ',
  booking_note: 'ใบจอง',
};

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const docType = docTypeFromSlug((await params).type);
  return { title: `${docType ? `สร้าง${TYPE_LABEL[docType]}` : 'สร้างเอกสาร'} | Admin` };
}

export default async function NewDocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ from?: string; deposit?: string }>;
}) {
  const docType = docTypeFromSlug((await params).type);
  if (!docType) notFound();
  const { from, deposit } = await searchParams;

  const [bookingCustomers, directoryCustomers, products, serviceItems, sourceDoc, employees] = await Promise.all([
    getCustomers(),
    getCustomerDirectory(),
    getAllProductsAdmin(),
    getServiceItems(),
    from ? getDocumentById(from) : Promise.resolve(null),
    getActiveEmployees(),
  ]);
  const customers = mergeCustomerSources(bookingCustomers, directoryCustomers);

  let prefill: DocPrefill | undefined;
  if (sourceDoc) {
    const lineDiscTotal = sourceDoc.items.reduce((sum, i) => {
      const gross = i.qty * i.unitPrice;
      return sum + (i.discountType === 'amt' ? Math.min(i.discount, gross) : gross * (i.discount / 100));
    }, 0);
    const globalDiscount = Math.max(0, (sourceDoc.discountTotal || 0) - lineDiscTotal);

    const isDepositReceipt = docType === 'invoice' && deposit === '1' && sourceDoc.type === 'booking_note' && sourceDoc.depositAmount > 0;

    if (isDepositReceipt) {
      // ออกใบเสร็จเฉพาะยอดมัดจำ — line item เดียว ราคา = depositAmount อ้างอิงใบจองในหมายเหตุ
      const firstItemName = sourceDoc.items[0]?.description ?? 'สินค้า/บริการ';
      prefill = {
        docType: 'invoice',
        customerName:    sourceDoc.customerName,
        customerPhone:   sourceDoc.customerPhone,
        customerCar:     sourceDoc.customerCar,
        customerAddress: sourceDoc.customerAddress,
        customerTaxId:   sourceDoc.customerTaxId,
        customerBranch:  sourceDoc.customerBranch,
        bookingRef:      sourceDoc.bookingRef,
        items: [{ description: `มัดจำ – ${firstItemName}`, qty: 1, unitPrice: sourceDoc.depositAmount, discount: 0 }],
        vatRate:       0,
        paymentMethod: sourceDoc.paymentMethod,
        note:          `มัดจำจากใบจอง ${sourceDoc.docNumber}`,
        sourceDocId:        sourceDoc.id,
        sourceDocNumber:    sourceDoc.docNumber,
        sourceDocTypeLabel: TYPE_LABEL[sourceDoc.type],
        depositAmount:      0,
        globalDiscount:     0, // Deposit receipts usually don't carry over global discounts
      };
    } else {
      prefill = {
        docType,
        customerName:    sourceDoc.customerName,
        customerPhone:   sourceDoc.customerPhone,
        customerCar:     sourceDoc.customerCar,
        customerAddress: sourceDoc.customerAddress,
        customerTaxId:   sourceDoc.customerTaxId,
        customerBranch:  sourceDoc.customerBranch,
        bookingRef:      sourceDoc.bookingRef,
        items: sourceDoc.items.map((i) => ({ productId: i.productId, description: i.description, qty: i.qty, unitPrice: i.unitPrice, discount: i.discount })),
        vatRate:       sourceDoc.vatRate,
        paymentMethod: sourceDoc.paymentMethod,
        note:          sourceDoc.note,
        sourceDocId:        sourceDoc.id,
        sourceDocNumber:    sourceDoc.docNumber,
        sourceDocTypeLabel: TYPE_LABEL[sourceDoc.type],
        // มัดจำติดไปกับเอกสารต่อยอดทุกชนิด (ใบจอง/ใบเสนอราคา → ใบเสร็จ ฯลฯ) — แม่แบบจะหักและแสดงยอดคงเหลือ
        depositAmount:      sourceDoc.depositAmount ?? 0,
        globalDiscount,
      };
    }
  }

  return <NewDocumentClient key={docType} customers={customers} products={products} serviceItems={serviceItems} employees={employees} prefill={prefill} initialType={docType} />;
}
