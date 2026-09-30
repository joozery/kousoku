import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, FileText, ArrowRight, ChevronRight, CalendarDays, Mail, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import connectDB from '@/lib/mongodb';
import { LegalPage } from '@/models/LegalPage';
import { LEGAL_DEFAULTS } from '@/lib/legal-content';
import { splitLegalContent } from '@/lib/legal-sections';
import { CONTACT_INFO } from '@/lib/home-content';
import { CookieSettingsButton } from '@/components/home/cookie-consent';
import type { LegalKey } from '@/app/actions/legal';

const shell = 'mx-auto max-w-7xl px-6 lg:px-10';

export async function LegalSection({ kind, locale }: { kind: LegalKey; locale: string }) {
  const t = await getTranslations({ locale, namespace: 'legalPage' });
  let document: { title: string; content: string; updatedAt?: Date } = LEGAL_DEFAULTS[kind];
  let unavailable = false;
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const stored = await LegalPage.findOne({ key: kind }).lean() as { title: string; content: string; updatedAt?: Date } | null;
      if (stored) document = stored;
    } catch { unavailable = true; }
  }
  const { intro, sections } = splitLegalContent(unavailable ? '' : document.content);
  const Icon = kind === 'privacy' ? ShieldCheck : FileText;
  const other = kind === 'privacy' ? 'terms' : 'privacy';
  const title = t(`${kind}.title`);

  return <main className="bg-[#f8fafc] text-[#102654]">
    <section className="relative isolate overflow-hidden bg-[#06274c] text-white">
      <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05264d]/95 via-[#05264d]/85 to-[#05264d]/30" />
      <div className={`relative py-12 lg:py-14 ${shell}`}><p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.23em] text-sky-200"><span className="h-px w-7 bg-sky-300/70" />{kind === 'privacy' ? 'PRIVACY POLICY' : 'TERMS OF SERVICE'}</p><h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]">{title}</h1><p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-50">{t(`${kind}.intro`)}</p></div>
    </section>
    <nav aria-label={t('breadcrumb')} className="border-b border-blue-100/60 bg-white"><ol className={`flex flex-wrap items-center gap-2 py-4 text-xs text-[#7486a7] ${shell}`}><li><Link href="/" className="hover:text-blue-700">{t('home')}</Link></li><li aria-hidden="true"><ChevronRight size={12} /></li><li aria-current="page">{title}</li></ol></nav>
    <div className={`grid items-start gap-7 py-9 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-9 lg:py-12 ${shell}`}>
      <aside className="space-y-5 lg:sticky lg:top-24">
        <nav aria-label={t('contents')} className="rounded-xl border border-blue-100/70 bg-white p-5"><p className="text-[10px] font-bold tracking-[0.2em] text-blue-500">ON THIS PAGE</p><h2 className="mt-2 text-lg font-bold">{t('contents')}</h2><ul className="mt-4 space-y-1">{sections.map(section => <li key={section.id}><a href={`#${section.id}`} lang="th" className="block rounded-lg px-3 py-2.5 text-sm leading-relaxed text-[#657b9f] transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600">{section.heading}</a></li>)}<li><a href="#legal-contact" className="block rounded-lg px-3 py-2.5 text-sm text-[#657b9f] hover:bg-blue-50 hover:text-blue-700">{t('contact')}</a></li></ul></nav>
        <div className="rounded-xl bg-[#0b3266] p-5 text-white"><Icon size={27} strokeWidth={1.6} className="text-sky-200" aria-hidden="true" /><h2 className="mt-3 text-lg font-bold">{t('helpTitle')}</h2><p className="mt-2 text-sm leading-relaxed text-blue-100">{t('helpIntro')}</p><Link href="/contact" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{t('contact')}<ArrowRight size={14} /></Link></div>
        {kind === 'privacy' && <div className="rounded-xl bg-blue-700 px-5 py-3 text-center text-sm font-semibold text-white"><CookieSettingsButton /></div>}
      </aside>
      <article className="min-w-0 overflow-hidden rounded-2xl border border-blue-100/70 bg-white shadow-[0_3px_18px_rgba(15,45,85,0.04)]">
        <header className="border-b border-blue-100/70 p-6 sm:p-8"><span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={25} strokeWidth={1.7} aria-hidden="true" /></span><h2 lang="th" className="mt-4 text-2xl font-bold">{unavailable ? title : document.title}</h2><p className="mt-2 text-xs font-semibold tracking-wide text-[#8193b2]">KOUSOKU (THAILAND) CO., LTD.</p>{document.updatedAt && !unavailable && <p className="mt-4 flex items-center gap-2 text-xs text-[#7486a7]"><CalendarDays size={14} aria-hidden="true" />{t('updated')}: <time dateTime={new Date(document.updatedAt).toISOString()}>{new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : locale === 'ja' ? 'ja-JP' : 'en-GB', { dateStyle: 'long', timeZone: 'Asia/Bangkok' }).format(new Date(document.updatedAt))}</time></p>}{locale !== 'th' && <p className="mt-3 text-xs leading-relaxed text-[#7486a7]">{t('languageNote')}</p>}</header>
        <div className="p-6 sm:p-8">
          {unavailable ? <p role="status" className="rounded-lg bg-blue-50 p-5 text-sm leading-relaxed">{t('unavailable')}</p> : <div lang="th">{intro.length > 0 && <div className="mb-8 rounded-xl bg-blue-50/60 p-5">{intro.map((paragraph, index) => <p key={index} className="whitespace-pre-line text-sm leading-8 text-[#536d93]">{paragraph}</p>)}</div>}{sections.map(section => <section key={section.id} id={section.id} className="mb-8 scroll-mt-24 border-b border-blue-100/70 pb-8 last:mb-0 last:border-0 last:pb-0"><h3 className="text-lg font-bold leading-relaxed text-[#102654]">{section.heading}</h3>{section.paragraphs.map((paragraph, index) => <p key={index} className="mt-3 whitespace-pre-line break-words text-sm leading-8 text-[#607496]">{paragraph}</p>)}</section>)}{!intro.length && !sections.length && <p className="text-sm text-slate-500">{t('empty')}</p>}</div>}
          <section id="legal-contact" className="mt-9 scroll-mt-24 rounded-xl border border-blue-100 bg-[#f8fbff] p-5"><h3 className="text-lg font-bold">{t('contact')}</h3><p className="mt-2 text-sm font-semibold">KOUSOKU (THAILAND) CO., LTD.</p><p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#607496]"><MapPin size={18} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />{CONTACT_INFO.address}</p><a href={`mailto:${CONTACT_INFO.email}`} className="mt-3 inline-flex items-center gap-2 break-all text-sm font-semibold text-blue-700 hover:underline"><Mail size={16} aria-hidden="true" />{CONTACT_INFO.email}</a></section>
          <Link href={`/${other}`} className="mt-6 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">{t(`${other}.title`)}<ArrowRight size={15} /></Link>
        </div>
      </article>
    </div>
  </main>;
}
