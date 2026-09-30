'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  MapPin,
  Phone,
  Mail,
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Copy,
  Check,
  Clock,
} from 'lucide-react';
import { NAV_ITEMS, CONTACT_INFO } from '@/lib/home-content';
import { FacebookIcon, LineIcon, YoutubeIcon } from '@/components/home/brand-icons';

const SOCIALS = [
  { label: 'Facebook', icon: FacebookIcon, hover: 'hover:bg-[#1877F2]' },
  { label: 'LINE', icon: LineIcon, hover: 'hover:bg-[#06C755]' },
  { label: 'YouTube', icon: YoutubeIcon, hover: 'hover:bg-[#FF0000]' },
];

export function SiteFooter() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [copied, setCopied] = useState(false);

  const handleCopyLine = () => {
    navigator.clipboard.writeText(CONTACT_INFO.lineId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-b from-[#0e275c] via-[#0a1e48] to-[#071638] text-blue-100 text-xs"
    >
      {/* ── Top Laser Accent Line ── */}
      <div className="relative h-[2px] w-full bg-blue-900/60">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      </div>

      {/* ── Subtle Background Blue Glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-blue-500/15 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]"
      />

      {/* ── Main Footer Body (Mobile Optimized Grid) ── */}
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10">
        {/* ── Col 1: Brand & Slogan (Mobile: full width, Desktop: 4 cols) ── */}
        <div className="sm:col-span-2 lg:col-span-4 flex flex-col justify-between space-y-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-white px-3 py-1.5 shadow-sm border border-white/20 hover:opacity-95 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logokosoku.png"
                alt="KOUSOKU (THAILAND) CO., LTD."
                className="h-7.5 sm:h-8 w-auto object-contain"
              />
            </Link>

            <p className="mt-3 text-sm sm:text-base font-bold text-white leading-snug">
              {t('taglinePrefix')}
              <span className="text-amber-400">{t('taglineHighlight')}</span>
            </p>
            <p className="mt-1 text-[10px] sm:text-[10.5px] font-semibold tracking-wider text-blue-200/80 uppercase">
              {t('taglineSub')}
            </p>

            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-blue-200/90">
              <Clock size={12} className="text-amber-400 shrink-0" />
              <span>{t('hours')}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-blue-200/80 uppercase mb-2">
              {t('followUs')}
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className={`grid h-8 w-8 sm:h-7 sm:w-7 place-items-center rounded-md bg-white/10 text-blue-100 border border-white/10 transition-all duration-200 active:scale-95 hover:text-white ${s.hover}`}
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Col 2: Navigation Menu (Mobile: 1 col, Desktop: 2 cols) ── */}
        <div className="col-span-1 lg:col-span-2">
          <div className="flex items-center gap-1.5 mb-2.5 sm:mb-3">
            <span className="h-3 w-1 bg-amber-400" />
            <p className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">{t('mainMenu')}</p>
          </div>
          <ul className="space-y-1.5 sm:space-y-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1 py-0.5 text-[12px] sm:text-[12.5px] text-blue-100/90 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={12}
                    className="-ml-0.5 opacity-40 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                  <span>{tNav(item.key)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Contact Info (Mobile: 1 col, Desktop: 3 cols) ── */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center gap-1.5 mb-2.5 sm:mb-3">
            <span className="h-3 w-1 bg-amber-400" />
            <p className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">{t('contactHeading')}</p>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10 mt-0.5">
                <MapPin size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">{t('addressLabel')}</span>
                <span className="block text-[11.5px] sm:text-[12px] text-blue-50 leading-snug">
                  {CONTACT_INFO.address}
                </span>
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10">
                <Phone size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">{t('phoneLabel')}</span>
                <a
                  href={CONTACT_INFO.phoneHref}
                  className="block text-[11.5px] sm:text-[12px] text-blue-50 hover:text-amber-300 font-medium transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10">
                <Mail size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">{t('emailLabel')}</span>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="block text-[11.5px] sm:text-[12px] text-blue-50 hover:text-amber-300 transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* ── Col 4: LINE Smart Card (Mobile: full width, Desktop: 3 cols) ── */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="rounded-lg bg-white/[0.06] p-3.5 sm:p-4 border border-white/15 backdrop-blur-sm shadow-lg">
            <p className="text-[11px] font-bold tracking-wider text-amber-400 uppercase mb-2">
              {t('lineHeading')}
            </p>

            <p className="text-[11px] sm:text-[11.5px] text-blue-100/90 leading-snug">
              {t('lineDesc')}
            </p>

            <div className="mt-3 flex items-center gap-3">
              {/* QR Image */}
              <div className="shrink-0 rounded-md bg-white p-1 shadow-sm border border-white/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/line-qr.png"
                  alt="LINE Official QR Code"
                  className="h-14 w-14 sm:h-16 sm:w-16 object-contain"
                />
              </div>

              {/* Button & Copy ID */}
              <div className="min-w-0 flex-1 space-y-2">
                <button
                  type="button"
                  onClick={handleCopyLine}
                  className="inline-flex items-center gap-1 rounded bg-white/10 hover:bg-white/15 active:bg-white/20 px-2 py-1 text-[10.5px] text-blue-50 border border-white/15 transition-colors"
                  title={t('copyLineId')}
                >
                  {copied ? (
                    <>
                      <Check size={10} className="text-emerald-400" />
                      <span className="text-emerald-300">{t('copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} className="text-blue-200" />
                      <span>{CONTACT_INFO.lineId}</span>
                    </>
                  )}
                </button>

                <a
                  href={CONTACT_INFO.lineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-md bg-[#06C755] hover:bg-[#05b54d] active:scale-95 px-3 py-1.5 text-[11.5px] font-bold text-white shadow-sm transition-transform"
                >
                  <LineIcon />
                  <span>{t('addFriend')}</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-Footer / Copyright Bar (Mobile Responsive) ── */}
      <div className="relative border-t border-white/10 bg-[#05112b]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10.5px] sm:text-[11px] text-blue-200/80">
          <p className="text-center sm:text-left">
            {t('copyright')}
          </p>

          <div className="flex items-center justify-center gap-3.5 sm:gap-4">
            <a href="#privacy" className="hover:text-white transition-colors py-1">
              {t('privacy')}
            </a>
            <span aria-hidden className="h-2.5 w-px bg-white/20" />
            <a href="#terms" className="hover:text-white transition-colors py-1">
              {t('terms')}
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label={t('backToTop')}
              className="ml-1 grid h-7 w-7 place-items-center rounded-md bg-amber-400 text-blue-950 hover:bg-amber-300 active:scale-90 transition-all shadow-sm"
              title={t('backToTop')}
            >
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
