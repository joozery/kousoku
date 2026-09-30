'use client';

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Cookie, ShieldCheck, Settings2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { CONSENT_COOKIE, CONSENT_EVENT, CONSENT_SETTINGS_EVENT, CONSENT_MAX_AGE, parseConsent } from '@/lib/cookie-consent';

function readCookie() {
  const value = document.cookie.split('; ').find(item => item.startsWith(`${CONSENT_COOKIE}=`));
  try { return value ? decodeURIComponent(value.slice(CONSENT_COOKIE.length + 1)) : ''; } catch { return ''; }
}
function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('focus', callback);
  return () => { window.removeEventListener(CONSENT_EVENT, callback); window.removeEventListener('focus', callback); };
}
function serverSnapshot() { return 'pending'; }
export function useCookieConsent() {
  const raw = useSyncExternalStore(subscribe, readCookie, serverSnapshot);
  const consent = useMemo(() => parseConsent(raw), [raw]);
  return { ready: raw !== 'pending', consent };
}
export function CookieSettingsButton() {
  const t = useTranslations('cookieConsent');
  return <button type="button" onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))} className="py-1 transition-colors hover:text-white">{t('settings')}</button>;
}

export function CookieConsentBanner() {
  const t = useTranslations('cookieConsent');
  const { ready, consent } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const [external, setExternal] = useState(false);
  const [error, setError] = useState(false);
  function showSettings() { setExternal(consent?.external ?? false); setError(false); setOpen(true); }
  useEffect(() => {
    const handler = () => { setExternal(consent?.external ?? false); setError(false); setOpen(true); };
    window.addEventListener(CONSENT_SETTINGS_EVENT, handler);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, handler);
  }, [consent]);

  function save(allowExternal: boolean) {
    const value = JSON.stringify({ version: 1, external: allowExternal, savedAt: Date.now() });
    try {
      document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
      if (readCookie() !== value) throw new Error('Cookie unavailable');
      window.dispatchEvent(new Event(CONSENT_EVENT));
      setError(false); setOpen(false);
    } catch { setError(true); }
  }
  const button = 'min-h-11 rounded-full border border-blue-200 px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600';
  return <>
    {ready && !consent && !open && <section aria-labelledby="cookie-banner-title" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-6xl overflow-auto rounded-2xl border border-blue-100 bg-white p-5 text-[#102654] shadow-[0_8px_50px_rgba(4,30,70,0.25)] max-h-[70dvh] sm:inset-x-6 sm:bottom-5 sm:p-6">
      <div className="flex items-start gap-4"><span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 sm:flex"><Cookie size={26} aria-hidden="true" /></span><div className="flex-1"><h2 id="cookie-banner-title" className="text-lg font-bold">{t('title')}</h2><p className="mt-2 max-w-4xl text-sm leading-relaxed text-[#65799b]">{t('intro')}</p><div className="mt-4 flex flex-wrap gap-2"><button onClick={() => save(false)} className={`${button} bg-white text-blue-700 hover:bg-blue-50`}>{t('reject')}</button><button onClick={showSettings} className={`${button} inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50`}><Settings2 size={16} aria-hidden="true" />{t('settings')}</button><button onClick={() => save(true)} className={`${button} bg-blue-700 text-white hover:bg-blue-800`}>{t('accept')}</button></div>{error && <p role="alert" className="mt-3 text-sm text-red-700">{t('error')}</p>}</div></div>
    </section>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg"><DialogTitle className="pr-6 text-xl font-bold text-[#102654]">{t('settings')}</DialogTitle><DialogDescription className="text-sm leading-relaxed text-slate-500">{t('description')}</DialogDescription><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"><div className="flex items-center justify-between gap-3"><h3 className="flex items-center gap-2 font-semibold text-blue-950"><ShieldCheck size={19} />{t('necessary')}</h3><span className="text-xs font-semibold text-blue-700">{t('alwaysOn')}</span></div><p className="mt-2 text-sm leading-relaxed text-slate-600">{t('necessaryIntro')}</p></div><label className="block rounded-xl border border-blue-100 p-4"><span className="flex items-center justify-between gap-4"><span className="font-semibold text-blue-950">{t('external')}</span><input type="checkbox" checked={external} onChange={event => setExternal(event.target.checked)} className="h-5 w-5 shrink-0 accent-blue-600" /></span><span className="mt-2 block text-sm leading-relaxed text-slate-600">{t('externalIntro')}</span></label><p className="text-xs leading-relaxed text-slate-500">{t('retention')}</p><div className="flex flex-wrap gap-2"><button onClick={() => save(false)} className={`${button} flex-1 text-blue-700 hover:bg-blue-50`}>{t('reject')}</button><button onClick={() => save(external)} className={`${button} flex-1 bg-blue-700 text-white hover:bg-blue-800`}>{t('save')}</button></div>{error && <p role="alert" className="text-sm text-red-700">{t('error')}</p>}</DialogContent></Dialog>
  </>;
}
