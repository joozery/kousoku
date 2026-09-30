'use client';
import { useTranslations } from 'next-intl';
import { MapPin, Settings2, ArrowUpRight } from 'lucide-react';
import { useCookieConsent } from './cookie-consent';
import { CONSENT_SETTINGS_EVENT } from '@/lib/cookie-consent';

export function ConsentMap({ query, title }: { query: string; title: string }) {
  const { consent } = useCookieConsent();
  const t = useTranslations('cookieConsent');
  if (consent?.external) return <iframe title={title} src={`https://maps.google.com/maps?q=${query}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-80 w-full border-0 bg-blue-50 lg:h-full lg:min-h-80" allowFullScreen />;
  return <div className="flex min-h-80 flex-col items-center justify-center bg-blue-50 p-7 text-center"><MapPin size={34} className="text-blue-600" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-blue-950">{t('mapTitle')}</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{t('mapIntro')}</p><button onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800"><Settings2 size={16} />{t('settings')}</button><a href={`https://www.google.com/maps/search/?api=1&query=${query}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-10 items-center gap-2 text-sm text-blue-700 hover:underline">{t('openMap')}<ArrowUpRight size={15} /></a></div>;
}
