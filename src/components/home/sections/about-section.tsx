import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, Package, UsersRound, Globe2, Gem, Settings, Truck, Target, Mountain } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const STATS = [Building2, Package, UsersRound, Globe2];
const VALUES = [Gem, Settings, UsersRound, Truck];
const YEARS = ['2013', '2016', '2020', '2023', 'present'];
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.23em] text-blue-500">{children}<span aria-hidden="true" className="h-px w-16 bg-gradient-to-r from-blue-300 to-blue-100" /></p>;
}

export function AboutSection() {
  const t = useTranslations('about');
  const p = useTranslations('aboutPage');

  return (
    <main className="text-[#10275b]">
      <section className="relative isolate overflow-hidden bg-[#092b50] text-white">
        <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06264c]/95 via-[#06264c]/55 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-14">
          <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.25em] text-sky-200"><span aria-hidden="true" className="h-px w-7 bg-sky-300" />ABOUT US<span aria-hidden="true" className="h-px w-16 bg-sky-300/50" /></p>
          <h1 className="mt-2 text-4xl font-bold leading-tight lg:text-[46px]">{t('title')}</h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-base font-medium leading-relaxed text-blue-50 lg:text-lg">{p('intro')}</p>
        </div>
      </section>

      <section aria-labelledby="about-company" className="bg-white py-9 lg:py-10">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 lg:grid-cols-[0.95fr_1.15fr] lg:gap-12 lg:px-10">
          <div>
            <Eyebrow>OUR COMPANY</Eyebrow>
            <h2 id="about-company" className="mt-2 text-xl font-extrabold leading-snug text-[#071c70] xl:text-[25px]">{t('companyName')}</h2>
            <p className="mt-1 text-xl font-bold text-[#071c70]">{p('tagline')}</p>
            <p className="mt-3 text-sm leading-[1.75] text-[#5b6e91]">{p('body')}</p>
            <a href="#about-vision" className={`mt-4 ${buttonClass}`}>{p('learnMore')}<ArrowRight size={15} aria-hidden="true" /></a>
          </div>
          <dl className="grid grid-cols-2 gap-y-7 rounded-2xl bg-gradient-to-br from-blue-50/90 to-[#f5f8fd] px-3 py-8 sm:grid-cols-4 sm:gap-y-0 lg:py-9">
            {STATS.map((Icon, index) => (
              <div key={index} className={`flex flex-col items-center px-2 text-center ${index > 0 ? 'sm:border-l sm:border-blue-100' : ''}`}>
                <Icon size={38} strokeWidth={1.5} className="mb-4 text-blue-600" aria-hidden="true" />
                <dt className="order-2 mt-3 whitespace-pre-line text-sm leading-relaxed text-[#5b6e91]">{p(`stats.${index}.label`)}</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-blue-700 xl:text-[28px]">{p(`stats.${index}.value`)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-label={p('valuesLabel')} className="relative isolate overflow-hidden bg-[#f0f7ff]">
        <div className="absolute inset-y-0 right-0 hidden w-[32%] lg:block">
          <Image src="/news/news-iso.jpg" alt="" fill sizes="32vw" className="object-cover object-[65%_40%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f0f7ff] via-[#f0f7ff]/25 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-9">
          <ul className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:w-[80%]">
            {VALUES.map((Icon, index) => (
              <li key={index} className={`relative px-3 text-center ${index > 0 ? 'sm:before:absolute sm:before:top-4 sm:before:bottom-3 sm:before:left-0 sm:before:w-px sm:before:bg-blue-200/70' : ''}`}>
                <Icon size={39} strokeWidth={1.5} aria-hidden="true" className="mx-auto text-blue-600" />
                <h2 className="mt-3 text-base font-bold text-[#071c70]">{p(`values.${index}.title`)}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#5b6e91]">{p(`values.${index}.description`)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="about-history" aria-labelledby="history-title" className="scroll-mt-24 bg-white py-9 lg:py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.85fr_1.75fr] lg:items-center lg:gap-10 lg:px-10">
          <div>
            <Eyebrow>OUR HISTORY</Eyebrow>
            <h2 id="history-title" className="mt-2 text-[28px] font-bold text-[#071c70]">{p('historyTitle')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5b6e91]">{p('historyIntro')}</p>
            <Link href="/contact" className={`mt-4 ${buttonClass}`}>{t('cta')}<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <ol className="relative grid gap-6 sm:grid-cols-5 sm:gap-3 sm:pt-3 sm:before:absolute sm:before:top-7 sm:before:right-3 sm:before:left-3 sm:before:h-px sm:before:bg-blue-400">
            {YEARS.map((year, index) => (
              <li key={year} className="relative grid grid-cols-[2.5rem_1fr] gap-x-3 sm:block sm:text-center">
                <div className="relative flex h-9 items-center justify-center">
                  {index === 4 ? <span className="grid h-9 w-9 place-items-center rounded-full border border-blue-600 bg-white text-blue-600"><ArrowRight size={19} aria-hidden="true" /></span> : <span className="h-3.5 w-3.5 rounded-full bg-blue-700 ring-[6px] ring-blue-100" />}
                </div>
                <div className="sm:mt-3">
                  <p className="text-lg font-bold text-blue-700">{year === 'present' ? p('present') : year}</p>
                  <h3 className="mt-1 text-[13px] font-bold text-[#071c70]">{p(`history.${index}.title`)}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#5b6e91]">{p(`history.${index}.description`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="about-vision" aria-labelledby="vision-title" className="scroll-mt-24 bg-white pb-12 lg:pb-16">
        <div className="mx-auto grid max-w-7xl gap-7 px-6 lg:grid-cols-[1fr_1.2fr] lg:items-stretch lg:px-10">
          <div className="relative min-h-64 overflow-hidden rounded-lg lg:min-h-72">
            <Image src="/cover/why-ksk-bg.jpg" alt={p('warehouseAlt')} fill sizes="(min-width: 1024px) 550px, 100vw" className="object-cover" />
          </div>
          <div>
            <Eyebrow>OUR VISION</Eyebrow>
            <h2 id="vision-title" className="mt-1 text-[28px] font-bold text-[#071c70]">{p('visionTitle')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {([Target, Mountain] as const).map((Icon, index) => (
                <article key={index} className={`relative isolate overflow-hidden rounded-lg p-5 ${index === 0 ? 'bg-[#eff6ff]' : 'bg-[#fff7e7]'}`}>
                  <Image src={index === 0 ? '/industries/infrastructure.jpg' : '/products/steel-pipe.jpg'} alt="" fill sizes="320px" className="object-cover opacity-[0.09]" />
                  <div className="relative flex items-start gap-3">
                    <Icon size={37} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-blue-600" />
                    <div>
                      <h3 className="text-sm font-bold text-[#071c70]">{p(`purpose.${index}.title`)}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-[#5b6e91]">{p(`purpose.${index}.description`)}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
