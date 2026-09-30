import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Package, ShieldCheck, Truck, MessagesSquare, FileText, Settings } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const SERVICES = [
  { key: 'sourcing', icon: Package, image: '/products/copper.jpg', href: '/products' },
  { key: 'consulting', icon: ShieldCheck, image: '/news/news-iso.jpg', href: '/contact' },
  { key: 'delivery', icon: Truck, image: '/cover/why-ksk-bg.jpg', href: '/contact' },
  { key: 'assurance', icon: ShieldCheck, image: '/industries/manufacturing.jpg', href: '/contact' },
] as const;
const STEPS = [MessagesSquare, FileText, Settings, Truck];

export function ServicesSection() {
  const t = useTranslations('servicesPage');
  const tc = useTranslations('common');

  return (
    <main>
      <section className="relative isolate overflow-hidden bg-[#0b2c52] text-white">
        <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#09294f]/90 via-[#09294f]/45 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-14">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.23em] text-sky-200"><span className="h-px w-7 bg-sky-300" />SERVICES</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight lg:text-[46px]">{t('title')}</h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-base font-medium leading-relaxed text-blue-50 lg:text-lg">{t('intro')}</p>
        </div>
      </section>

      <section aria-label={t('title')} className="bg-[#f8fafc] py-10 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {SERVICES.map(({ key, icon: Icon, image, href }) => (
            <article key={key} className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-[0_3px_12px_rgba(15,45,85,0.07)] ring-1 ring-slate-200/50 transition-shadow hover:shadow-lg">
              <div className="relative aspect-[2.12/1] overflow-hidden">
                <Image src={image} alt={t(`cards.${key}.title`)} fill sizes="(min-width: 1280px) 285px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
              </div>
              <div className="relative flex flex-1 flex-col px-5 pb-5">
                <span className="-mt-6 mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-700"><Icon size={30} strokeWidth={1.8} aria-hidden="true" /></span>
                <h2 className="text-base font-bold leading-relaxed text-[#142c54]">{t(`cards.${key}.title`)}</h2>
                <p className="mt-1.5 flex-1 text-[13px] leading-[1.85] text-[#7183a2]">{t(`cards.${key}.description`)}</p>
                <Link href={href} aria-label={`${t('details')} — ${t(`cards.${key}.title`)}`} className="mt-4 inline-flex min-h-8 items-center gap-2 self-start rounded text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">{t('details')}<ArrowRight size={15} aria-hidden="true" /></Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="service-process" className="bg-gradient-to-br from-[#eef6ff] via-[#f4f8fd] to-[#eaf2fc] pt-8 pb-12 lg:pt-10 lg:pb-16">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-6 lg:grid-cols-[1.25fr_1fr] lg:px-10">
          <div className="min-w-0 py-2">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-blue-600">OUR PROCESS<span className="h-px w-12 bg-blue-300" /></p>
            <h2 id="service-process" className="mt-1 text-3xl font-bold text-[#083a87]">{t('processTitle')}</h2>
            <p className="mt-2 max-w-lg text-[13px] leading-relaxed text-[#7183a2]">{t('processIntro')}</p>
            <ol className="mt-6 grid grid-cols-2 gap-x-7 gap-y-6 sm:grid-cols-4 sm:gap-5">
              {STEPS.map((Icon, index) => (
                <li key={index} className="relative">
                  <div className="flex items-center gap-2 text-blue-600"><span className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400 bg-white/70"><Icon size={22} strokeWidth={1.7} aria-hidden="true" /></span><span className="text-base">0{index + 1}</span></div>
                  {index < 3 && <ArrowRight size={16} aria-hidden="true" className="absolute top-3 right-0 hidden text-blue-500 sm:block" />}
                  <h3 className="mt-2 text-[13px] font-bold text-[#142c54]">{t(`steps.${index}.title`)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#7183a2]">{t(`steps.${index}.description`)}</p>
                </li>
              ))}
            </ol>
          </div>
          <aside className="relative isolate overflow-hidden rounded-xl bg-[#0c3670] px-8 py-10 text-white lg:py-11">
            <Image src="/news/news-iso.jpg" alt="" fill sizes="(min-width: 1024px) 500px, 100vw" className="object-cover object-[65%_center]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07316c] via-[#07316c]/85 to-[#07316c]/10" />
            <div className="relative max-w-[265px]">
              <h2 className="whitespace-pre-line text-[28px] font-bold leading-tight">{t('contactTitle')}</h2>
              <p className="mt-4 text-sm leading-relaxed text-blue-50">{t('contactIntro')}</p>
              <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{tc('requestQuote')}<ArrowRight size={15} aria-hidden="true" /></Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
