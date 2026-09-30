import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronRight, Gem, Settings, Truck, Headset, UsersRound, Package, Globe2, BriefcaseBusiness } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { INDUSTRIES } from '@/lib/home-content';

const HIGHLIGHTS = [Gem, Settings, Truck, Headset];
const METRICS = [BriefcaseBusiness, Package, UsersRound, Globe2];
const shell = 'mx-auto max-w-7xl px-6 lg:px-10';

export function IndustriesSection() {
  const t = useTranslations('industries');
  const p = useTranslations('industriesPage');
  const tc = useTranslations('common');

  return (
    <main className="bg-[#f8fafc] text-[#102654]">
      <section className="relative isolate overflow-hidden bg-[#062647] text-white">
        <Image src="/industries/energy.jpg" alt="" fill preload sizes="100vw" className="object-cover object-[center_48%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#022144]/95 via-[#022144]/65 to-[#022144]/10" />
        <div className={`relative py-12 lg:py-14 ${shell}`}>
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-200">OUR INDUSTRIES</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl lg:text-[44px]">{t('title')}</h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-base font-medium leading-relaxed text-blue-50">{p('intro')}</p>
        </div>
      </section>

      <nav aria-label={p('breadcrumbLabel')} className="border-b border-blue-100/50 bg-white/60">
        <ol className={`flex flex-wrap items-center gap-2 py-4 text-xs text-[#7283a4] ${shell}`}>
          <li><Link href="/" className="rounded transition-colors hover:text-blue-700">{tc('breadcrumbHome')}</Link></li>
          <li aria-hidden="true"><ChevronRight size={12} /></li>
          <li aria-current="page">{t('title')}</li>
        </ol>
      </nav>

      <section aria-labelledby="industries-overview" className={`pt-9 pb-9 lg:pt-10 ${shell}`}>
        <div className="grid items-center gap-7 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
          <div>
            <p className="text-[11px] font-bold tracking-[0.22em] text-blue-500">INDUSTRIES OVERVIEW</p>
            <h2 id="industries-overview" className="mt-2 whitespace-pre-line text-2xl font-bold leading-snug text-[#0a2052] lg:text-[29px]">{p('overviewTitle')}</h2>
            <p className="mt-3 text-sm leading-[1.75] text-[#607294]">{p('overviewIntro')}</p>
            <Link href="/contact" className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-700 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{p('consult')}<ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <ul className="grid grid-cols-2 gap-y-7 rounded-xl bg-gradient-to-br from-[#edf6ff] to-[#f1f7fe] px-3 py-7 sm:grid-cols-4 sm:gap-y-0 lg:py-8">
            {HIGHLIGHTS.map((Icon, index) => (
              <li key={index} className={`px-2 text-center ${index > 0 ? 'sm:border-l sm:border-blue-200/70' : ''}`}>
                <Icon size={38} strokeWidth={1.6} aria-hidden="true" className="mx-auto text-blue-600" />
                <h3 className="mt-4 text-xs font-bold leading-relaxed text-[#102654]">{p(`highlights.${index}.title`)}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#405a83]">{p(`highlights.${index}.description`)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map(({ key, code, icon: Icon }) => (
            <Link href="/contact" key={key} id={key} aria-label={`${t(`items.${key}`)} — ${p('consult')}`} className="group flex scroll-mt-24 flex-col overflow-hidden rounded-lg border border-blue-100/50 bg-white shadow-[0_3px_12px_rgba(15,45,85,0.05)] transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
              <div className="relative aspect-[1.75/1] overflow-hidden">
                <Image src={`/industries/${key}.jpg`} alt={t(`items.${key}`)} fill sizes="(min-width: 1280px) 385px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
              </div>
              <div className="relative flex flex-1 flex-col px-6 pb-6">
                <span className="-mt-7 mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-blue-50 bg-white text-blue-600 shadow-sm"><Icon size={29} strokeWidth={1.7} aria-hidden="true" /></span>
                <h3 className="text-xl font-bold leading-snug text-[#0b235c] group-hover:text-blue-700">{t(`items.${key}`)}</h3>
                <p className="mt-1.5 text-[10px] font-semibold tracking-[0.13em] text-[#8092b4] uppercase">{code}{key !== 'infrastructure' ? ' INDUSTRY' : ''}</p>
                <div className="mt-3 flex flex-1 items-end justify-between gap-4">
                  <p className="text-[13px] leading-relaxed text-[#63769a]">{p(`descriptions.${key}`)}</p>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-700 group-hover:text-white"><ArrowRight size={17} aria-hidden="true" /></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="industries-cta" className="relative isolate overflow-hidden bg-[#062648] text-white">
        <Image src="/products/steel-pipe.jpg" alt="" fill sizes="100vw" className="object-cover object-[right_55%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#032246] via-[#032246]/90 to-[#032246]/10" />
        <div className={`relative py-10 lg:py-12 ${shell}`}>
          <p className="text-[10px] font-semibold tracking-[0.23em] text-sky-200">LET’S BUILD TOGETHER</p>
          <h2 id="industries-cta" className="mt-3 whitespace-pre-line text-3xl font-bold leading-tight lg:text-[34px]">{p('ctaTitle')}</h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-blue-50">{p('ctaIntro')}</p>
          <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-amber-400 px-6 py-2 text-sm font-bold text-[#082650] transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">{tc('requestQuote')}<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-label={p('statsLabel')} className="bg-gradient-to-br from-[#eff6ff] to-[#f8fbff] py-10 lg:py-12">
        <dl className={`grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4 lg:gap-0 ${shell}`}>
          {METRICS.map((Icon, index) => (
            <div key={index} className={`flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left lg:justify-center lg:px-5 ${index > 0 ? 'lg:border-l lg:border-blue-200' : ''}`}>
              <Icon size={39} strokeWidth={1.6} aria-hidden="true" className="shrink-0 text-blue-600" />
              <div className="flex flex-col"><dt className="order-2 mt-1 text-xs leading-relaxed text-[#607294]">{p(`stats.${index}.label`)}</dt><dd className="text-2xl font-extrabold text-blue-700">{p(`stats.${index}.value`)}</dd></div>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
