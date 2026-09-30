'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react';

const field = 'mt-2 w-full rounded-lg border border-blue-100 bg-[#f8fafc] px-3.5 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

export function QuoteRequestForm() {
  const t = useTranslations('quoteForm');
  const locale = useLocale();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [reference, setReference] = useState('');
  const requestId = useRef('');
  const submitting = useRef(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true); setError(false);
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    requestId.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/quote-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, locale, requestId: requestId.current }) });
      if (!response.ok) throw new Error('Failed');
      const result = await response.json();
      setReference(result.reference);
      form.reset();
    } catch { setError(true); }
    finally { submitting.current = false; setPending(false); }
  }

  return <section id="quote-form" className="scroll-mt-24 rounded-2xl border border-blue-100/70 bg-white p-6 shadow-[0_4px_20px_rgba(15,45,85,0.04)] sm:p-8">
    <p className="text-[11px] font-bold tracking-[0.2em] text-blue-500">REQUEST A QUOTATION</p>
    <h2 className="mt-2 text-2xl font-bold">{t('title')}</h2><p className="mt-2 text-sm leading-relaxed text-[#7183a2]">{t('intro')}</p>
    {reference ? <div role="status" className="mt-6 rounded-xl bg-blue-50 p-6"><CheckCircle2 className="text-blue-600" size={32} /><h3 className="mt-3 text-lg font-bold">{t('success')}</h3><p className="mt-2 text-sm leading-relaxed">{t('successIntro')}</p><p className="mt-3 break-all text-xs text-slate-500">{t('reference')}: {reference}</p><button onClick={() => { setReference(''); requestId.current = ''; }} className="mt-5 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white">{t('another')}</button></div> : <form onSubmit={submit} className="mt-6">
      <fieldset disabled={pending} className="grid gap-5 sm:grid-cols-2 disabled:opacity-60">
        {(['name', 'company', 'email', 'phone'] as const).map(key => <label key={key} className="text-sm font-semibold">{t(key)}{key !== 'company' && <span className="text-blue-600"> *</span>}<input name={key} type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'} required={key !== 'company'} maxLength={key === 'email' ? 254 : key === 'phone' ? 30 : key === 'company' ? 150 : 100} minLength={key === 'phone' ? 7 : undefined} autoComplete={key === 'name' ? 'name' : key === 'company' ? 'organization' : key === 'phone' ? 'tel' : 'email'} className={field} /></label>)}
        <label className="text-sm font-semibold sm:col-span-2">{t('products')} <span className="text-blue-600">*</span><textarea name="products" required rows={3} maxLength={2000} placeholder={t('productsPlaceholder')} className={`${field} resize-y`} /></label>
        <label className="text-sm font-semibold sm:col-span-2">{t('quantity')} <span className="text-blue-600">*</span><input name="quantity" required maxLength={100} placeholder={t('quantityPlaceholder')} className={field} /></label>
        <label className="text-sm font-semibold sm:col-span-2">{t('details')}<textarea name="details" rows={3} maxLength={3000} placeholder={t('detailsPlaceholder')} className={`${field} resize-y`} /></label>
        <p className="text-xs leading-relaxed text-[#7183a2] sm:col-span-2">{t('note')}</p>
        <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-wait sm:col-span-2">{pending ? <LoaderCircle size={17} className="animate-spin" /> : <ArrowRight size={17} />}{t(pending ? 'sending' : 'submit')}</button>
      </fieldset>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm leading-relaxed text-red-700">{t('error')}</p>}
    </form>}
  </section>;
}
