import type { DocType } from '@/lib/documents';

// path ของหน้าสร้างเอกสารแต่ละประเภท: /admin/documents/new/<slug>
// ใบรับชำระ (payment_note) ออกอัตโนมัติจากการรับชำระใบแจ้งหนี้ จึงไม่มีหน้าสร้างเอง
export const CREATABLE_DOC_SLUGS = {
  invoice:      'invoice',
  quote:        'quote',
  billing_note: 'billing-note',
  credit_note:  'credit-note',
  booking_note: 'booking-note',
} as const satisfies Partial<Record<DocType, string>>;

export type CreatableDocType = keyof typeof CREATABLE_DOC_SLUGS;

export function docTypeFromSlug(slug: string): CreatableDocType | null {
  const hit = (Object.entries(CREATABLE_DOC_SLUGS) as [CreatableDocType, string][]).find(([, s]) => s === slug);
  return hit ? hit[0] : null;
}

export function newDocHref(type: CreatableDocType, query?: { from?: string; deposit?: boolean }): string {
  const params = new URLSearchParams();
  if (query?.from) params.set('from', query.from);
  if (query?.deposit) params.set('deposit', '1');
  const qs = params.toString();
  return `/admin/documents/new/${CREATABLE_DOC_SLUGS[type]}${qs ? `?${qs}` : ''}`;
}
