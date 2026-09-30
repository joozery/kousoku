import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ABOUT_HIGHLIGHTS } from '@/lib/home-content';

export function AboutTeaser() {
  const t = useTranslations('about');
  const tc = useTranslations('common');

  return (
    <section id="about" className="scroll-mt-16 py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Photo card — contained, not overlapping the text */}
        <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 lg:h-[420px] shadow-xl shadow-blue-950/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/produtmenu.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/0 to-transparent" />

          <div className="absolute left-4 right-4 sm:left-6 sm:right-auto bottom-4 sm:bottom-6 flex items-center gap-3 rounded-2xl bg-white/95 backdrop-blur px-3.5 py-2.5 sm:px-4 sm:py-3 shadow-lg">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-950 text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
              KSK
            </span>
            <p className="text-xs sm:text-sm font-bold text-blue-950 leading-snug">{t('companyName')}</p>
          </div>
        </div>

        {/* Text */}
        <div>
          <p className="text-xs font-bold tracking-[0.25em] text-blue-700 uppercase">{t('eyebrow')}</p>
          <h2 className="mt-2 text-2xl lg:text-4xl font-bold text-blue-950 leading-tight">{t('title')}</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">{t('teaserBody')}</p>

          <div className="mt-7 grid grid-cols-2 gap-3">
            {ABOUT_HIGHLIGHTS.map(h => (
              <div key={h.key} className="flex items-center gap-2.5 rounded-xl bg-white border border-slate-100 shadow-sm px-3.5 py-3">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <h.icon size={16} />
                </span>
                <p className="text-xs font-bold text-blue-950 leading-tight">{t(`highlights.${h.key}`)}</p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors"
          >
            {tc('readMore')} <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
