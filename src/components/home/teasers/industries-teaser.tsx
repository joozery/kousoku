'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, HardHat, Factory, Zap, Car, Cog, Landmark } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type IndustryMeta = {
  key: string;
  num: string;
  image: string;
  tag: string;
  icon: typeof HardHat;
  accent: string;
};

const INDUSTRY_CARDS: IndustryMeta[] = [
  {
    key: 'construction',
    num: '01',
    image: '/industries/construction.jpg',
    tag: 'CIVIL & STRUCTURAL',
    icon: HardHat,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
  {
    key: 'manufacturing',
    num: '02',
    image: '/industries/manufacturing.jpg',
    tag: 'FACTORY & FABRICATION',
    icon: Factory,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
  {
    key: 'energy',
    num: '03',
    image: '/industries/energy.jpg',
    tag: 'OIL, GAS & POWER',
    icon: Zap,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
  {
    key: 'automotive',
    num: '04',
    image: '/industries/automotive.jpg',
    tag: 'AUTOMOTIVE & OEM',
    icon: Car,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
  {
    key: 'machinery',
    num: '05',
    image: '/industries/machinery.jpg',
    tag: 'HEAVY EQUIPMENT & CNC',
    icon: Cog,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
  {
    key: 'infrastructure',
    num: '06',
    image: '/industries/infrastructure.jpg',
    tag: 'BRIDGES & PUBLIC UTILITIES',
    icon: Landmark,
    accent: 'from-blue-950 via-blue-950/60 to-transparent',
  },
];

export function IndustriesTeaser() {
  const t = useTranslations('industries');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const getTranslated = (key: string, fallback = '') => {
    try {
      return (t as (k: string) => string)(key);
    } catch {
      return fallback;
    }
  };

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
    const currentIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(currentIndex, 0), INDUSTRY_CARDS.length - 1));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 360;

    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 24
      : 360;

    el.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  return (
    <section id="industries" className="scroll-mt-16 py-10 lg:py-14 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section Header with CI styling & slider controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-px w-7 bg-blue-600" />
              <span className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold text-blue-950 tracking-tight leading-tight">
              {t('title')}
            </h2>
            <p className="mt-1.5 text-slate-500 text-sm max-w-2xl leading-relaxed">
              {t('teaserBody')}
            </p>
          </div>

          {/* Action buttons & slider navigation */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/industries"
              className="group hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 hover:bg-blue-700 hover:border-blue-700 text-blue-700 hover:text-white px-4 py-2 text-sm font-bold transition-all duration-200"
            >
              <span>{getTranslated('viewAll', 'ดูอุตสาหกรรมทั้งหมด')}</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* Slider Arrow Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                aria-label="Previous slide"
                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                  canScrollLeft
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 shadow-sm cursor-pointer'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                aria-label="Next slide"
                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                  canScrollRight
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-blue-700 hover:text-white hover:border-blue-700 shadow-sm cursor-pointer'
                    : 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Card Slide Carousel ── */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 -mx-6 px-6 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {INDUSTRY_CARDS.map(card => {
            const Icon = card.icon;
            const industryName = getTranslated(`items.${card.key}`, card.key);

            return (
              <Link
                key={card.key}
                href="/industries"
                className="group relative w-[80vw] sm:w-[300px] md:w-[330px] lg:w-[350px] shrink-0 h-[330px] sm:h-[350px] rounded-2xl overflow-hidden border border-slate-200/80 bg-blue-950 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 snap-start select-none"
              >
                {/* Background image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.image}
                  alt={industryName}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                {/* Gradients using CI Navy */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/60 to-blue-950/20" />

                {/* Top bar: number and icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-white/80 bg-blue-950/70 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                    {card.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-blue-950 group-hover:border-amber-400 transition-all duration-300">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                    {card.tag}
                  </p>
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                    {industryName}
                  </h3>

                  <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-slate-200">
                    <span className="group-hover:text-white transition-colors font-medium">
                      {getTranslated('exploreCard', 'ดูโซลูชันและสินค้า')}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-blue-950 group-hover:translate-x-1 transition-all duration-300">
                      <ArrowUpRight size={13} />
                    </div>
                  </div>
                </div>

                {/* Subtle bottom edge glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            );
          })}
        </div>

        {/* ── Pagination Dots & Mobile View All Link ── */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {INDUSTRY_CARDS.map((card, idx) => (
              <button
                key={card.key}
                type="button"
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  activeIndex === idx
                    ? 'w-7 bg-blue-700'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <Link
            href="/industries"
            className="sm:hidden inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <span>{getTranslated('viewAll', 'ดูอุตสาหกรรมทั้งหมด')}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </section>
  );
}
