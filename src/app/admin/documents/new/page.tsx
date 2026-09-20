import { redirect } from 'next/navigation';
import { docTypeFromSlug, newDocHref, type CreatableDocType } from '@/lib/doc-routes';

// path เดิม /admin/documents/new[?type=...&from=...] — ส่งต่อไปหน้าแยกตามประเภท (เผื่อมีลิงก์/บุ๊กมาร์กเก่า)
const LEGACY_TYPE: Record<string, CreatableDocType> = {
  invoice: 'invoice',
  quote: 'quote',
  billing_note: 'billing_note',
  credit_note: 'credit_note',
  booking_note: 'booking_note',
};

export default async function NewDocumentIndex({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; type?: string; deposit?: string }>;
}) {
  const { from, type, deposit } = await searchParams;
  const docType = (type && (LEGACY_TYPE[type] ?? docTypeFromSlug(type))) || 'invoice';
  redirect(newDocHref(docType, { from, deposit: deposit === '1' }));
}
