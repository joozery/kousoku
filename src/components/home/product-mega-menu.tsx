'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PRODUCTS } from '@/lib/home-content';

export function ProductMegaMenu({ open, onNavigate }: { open: boolean; onNavigate?: () => void }) {
  const t = useTranslations('products');

  return (
    <div
      className={`absolute left-0 right-0 top-full border-t border-slate-100 bg-white shadow-2xl transition-all duration-200 ease-out ${
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto visible'
          : 'opacity-0 -translate-y-2 pointer-events-none invisible'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-1 lg:grid-cols-[minmax(0,340px)_1fr] gap-10">
        {/* Left: visual panel */}
        <div className="relative overflow-hidden rounded-2xl p-8 flex flex-col justify-between min-h-[260px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/produtmenu.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-950/55 to-blue-950/10" />
          <div className="relative">
            <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">{t('eyebrow')}</p>
            <h3 className="mt-2 text-xl font-bold text-white leading-snug">{t('title')}</h3>
            <p className="mt-3 text-sm text-blue-100 leading-relaxed">{t('subtitle')}</p>
          </div>
          <Link
            href="/products"
            onClick={onNavigate}
            className="relative inline-flex items-center gap-1.5 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            {t('viewAll')} <ArrowRight size={15} />
          </Link>
        </div>

        {/* Right: link list with title + short description */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {PRODUCTS.map(p => (
            <Link
              key={p.key}
              href={`/products#${p.id}`}
              onClick={onNavigate}
              className="group flex items-start gap-4 rounded-xl p-4 hover:bg-slate-50 transition-colors"
            >
              <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <p.icon size={20} />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 font-bold text-blue-950">
                  {t(`items.${p.key}.name`)}
                  <ChevronRight
                    size={14}
                    className="text-slate-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                  />
                </span>
                <span className="block mt-1 text-sm text-slate-500 leading-relaxed">
                  {t(`items.${p.key}.desc`)}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
