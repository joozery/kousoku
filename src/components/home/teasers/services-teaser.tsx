'use client';

import { useTranslations } from 'next-intl';
import { ArrowRight, BadgeCheck, Truck, Users, BadgeDollarSign } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type ServiceItem = { title: string; desc: string };

const CARD_META = {
  quality:  {
    icon: BadgeCheck,
    num: '01',
    accent: '#1e40af',      // blue-800
    light: '#eff6ff',       // blue-50
    border: '#bfdbfe',      // blue-200
    iconColor: '#1d4ed8',
  },
  delivery: {
    icon: Truck,
    num: '02',
    accent: '#0369a1',      // sky-700
    light: '#f0f9ff',
    border: '#bae6fd',
    iconColor: '#0284c7',
  },
  team: {
    icon: Users,
    num: '03',
    accent: '#065f46',      // emerald-800
    light: '#ecfdf5',
    border: '#a7f3d0',
    iconColor: '#059669',
  },
  price: {
    icon: BadgeDollarSign,
    num: '04',
    accent: '#4c1d95',      // violet-900
    light: '#f5f3ff',
    border: '#ddd6fe',
    iconColor: '#7c3aed',
  },
};

const METRICS = [
  { value: '10+',  labelKey: 'metricYears'    },
  { value: '500+', labelKey: 'metricClients'  },
  { value: '4',    labelKey: 'metricProducts' },
  { value: '24h',  labelKey: 'metricDelivery' },
];

export function ServicesTeaser() {
  const t = useTranslations('services');
  const items = t.raw('items') as Record<string, ServiceItem>;
  const keys = Object.keys(items);

  const label = (key: string) => {
    try { return (t as (k: string) => string)(key); } catch { return ''; }
  };

  return (
    <section id="why-choose" className="scroll-mt-16 relative py-20 lg:py-28 overflow-hidden">
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover/why-ksk-bg.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/65 to-white/75" />
      {/* Subtle top/bottom fade to white so it blends with neighbours */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="h-px w-7 bg-blue-600" />
              <span className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-950 leading-tight">
              {t('title')}
            </h2>
            <p className="mt-2 text-slate-500 text-sm max-w-md">
              {t('tagline')}
            </p>
          </div>

          {/* Metrics row */}
          <div className="flex flex-wrap gap-8 lg:gap-10 shrink-0">
            {METRICS.map(m => (
              <div key={m.labelKey} className="text-center lg:text-right">
                <p className="text-3xl font-black text-blue-950 leading-none">{m.value}</p>
                <p className="mt-1 text-xs text-slate-400 font-medium">{label(m.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Feature cards: horizontal strip on desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
          {keys.map(key => {
            const item = items[key];
            const meta = CARD_META[key as keyof typeof CARD_META] ?? CARD_META.quality;
            const Icon = meta.icon;

            return (
              <div
                key={key}
                className="group relative flex flex-col bg-white p-7 hover:bg-slate-50 transition-colors duration-200"
              >
                {/* Number */}
                <span className="text-[11px] font-black text-slate-200 tracking-widest mb-5 group-hover:text-slate-300 transition-colors">
                  {meta.num}
                </span>

                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: meta.light, border: `1px solid ${meta.border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: meta.iconColor }} strokeWidth={2} />
                </div>

                {/* Text */}
                <p className="font-bold text-blue-950 text-sm leading-snug mb-1.5">{item.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">{item.desc}</p>

                {/* Bottom accent line — appears on hover */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b"
                  style={{ background: meta.accent }}
                />
              </div>
            );
          })}
        </div>

        {/* ── CTA strip ── */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-xl bg-blue-950 px-7 py-6">
          <div className="relative overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
              KOUSOKU (THAILAND) CO., LTD.
            </p>
            <p className="text-base font-bold text-white leading-snug">
              {t('teaserBody')}
            </p>
          </div>
          <Link
            href="/services"
            className="group shrink-0 inline-flex items-center gap-2 rounded bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-6 py-3 text-sm transition-colors"
          >
            {label('viewAll') || 'ดูบริการทั้งหมด'}
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
