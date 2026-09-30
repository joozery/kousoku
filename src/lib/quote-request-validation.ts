export type QuoteInput = {
  requestId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  products: string;
  quantity: string;
  details: string;
  locale: string;
};

export function validateQuoteRequest(value: unknown): QuoteInput | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const limits: Record<string, number> = { requestId: 36, name: 100, company: 150, email: 254, phone: 30, products: 2000, quantity: 100, details: 3000, locale: 2 };
  const result: Record<string, string> = {};
  for (const [key, limit] of Object.entries(limits)) {
    if (typeof source[key] !== 'string' || source[key].length > limit) return null;
    result[key] = source[key].trim();
  }
  if (!result.name || !result.products || !result.quantity) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) return null;
  if (!/^[+\d\s().-]{7,30}$/.test(result.phone) || result.phone.replace(/\D/g, '').length < 7) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result.requestId)) return null;
  if (!['th', 'en', 'ja'].includes(result.locale)) return null;
  result.email = result.email.toLowerCase();
  return result as QuoteInput;
}
