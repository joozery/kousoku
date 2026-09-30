import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { HERO_FEATURES } from '@/lib/home-content';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative overflow-hidden text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover/cover.png"
        alt="ท่อทองแดงและท่อเหล็กในโกดังสินค้า"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-400 uppercase">
          {t('eyebrow')}
        </p>

        <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          {t('titleLine1')}
          <br />
          {t('titleLine2')}
          <br />
          <span className="text-amber-400">{t('titleHighlight')}</span>
        </h1>

        <p className="mt-6 max-w-xl text-blue-100 text-base sm:text-lg">
          {t('subtitle')}
        </p>

        <ul className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
          {HERO_FEATURES.map(f => (
            <li key={f.key} className="flex items-center gap-2.5 text-sm font-semibold text-blue-50">
              <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <f.icon size={17} className="text-amber-400" />
              </span>
              {t(`features.${f.key}`)}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            {t('ctaQuote')} <ArrowRight size={18} />
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 border border-white/40 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full transition-colors"
          >
            {t('ctaProducts')}
          </Link>
        </div>
      </div>
    </section>
  );
}
