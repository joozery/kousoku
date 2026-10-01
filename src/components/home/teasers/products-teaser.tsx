import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type ProductItem = { name: string; desc: string };

const PRODUCT_META: Record<string, { image: string; accent: string; accentLight: string }> = {
  copper:            { image: '/company-profile/copper-piping.png',      accent: 'bg-amber-600',  accentLight: 'bg-amber-50 text-amber-700 border-amber-200' },
  steelPipe:         { image: '/company-profile/packaging-foam.png',     accent: 'bg-blue-800',   accentLight: 'bg-blue-50 text-blue-700 border-blue-200' },
  metalSupply:       { image: '/company-profile/labels.png',             accent: 'bg-slate-700',  accentLight: 'bg-slate-50 text-slate-700 border-slate-200' },
  fittingAccessories:{ image: '/company-profile/electrical-equipment.png', accent: 'bg-sky-700',  accentLight: 'bg-sky-50 text-sky-700 border-sky-200' },
};

export function ProductsTeaser() {
  const t = useTranslations('products');
  const items = t.raw('items') as Record<string, ProductItem>;
  const keys = Object.keys(items);

  return (
    <section id="products" className="scroll-mt-16 py-16 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-7 bg-blue-600" />
              <span className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-blue-950">{t('title')}</h2>
            <p className="mt-2 text-sm text-slate-500 max-w-xl">{t('teaserBody')}</p>
          </div>
          <Link
            href="/products"
            className="group shrink-0 inline-flex items-center gap-1.5 rounded border border-blue-200 hover:bg-blue-700 hover:border-blue-700 text-blue-700 hover:text-white px-4 py-2 text-sm font-bold transition-all duration-200"
          >
            {t('viewAll')}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Product cards grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {keys.map(key => {
            const item = items[key];
            const meta = PRODUCT_META[key] ?? { image: '', accent: 'bg-blue-800', accentLight: 'bg-blue-50 text-blue-700 border-blue-200' };

            return (
              <Link
                key={key}
                href="/products"
                className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-150 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-slate-100">
                  {meta.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={meta.image}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    />
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* Category label bottom-left */}
                  <div className="absolute bottom-3 left-3">
                    <span className={`inline-flex items-center rounded px-2.5 py-1 text-[11px] font-bold text-white ${meta.accent} bg-opacity-90`}>
                      {item.name}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <p className="text-sm font-bold text-blue-950 group-hover:text-blue-700 transition-colors">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {item.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:text-blue-800 transition-colors">
                    {t('viewMore')}
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── Banner strip ── */}
        <div className="mt-8 relative overflow-hidden rounded-xl bg-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 px-7 py-6">
          {/* Background warehouse photo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cover/cover.png"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-15"
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-1">KOUSOKU (THAILAND)</p>
            <p className="text-white font-bold text-base leading-snug">
              {t('subtitle')}
            </p>
          </div>
          <Link
            href="/products"
            className="relative shrink-0 inline-flex items-center gap-2 rounded bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-6 py-2.5 text-sm transition-colors"
          >
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </section>
  );
}
