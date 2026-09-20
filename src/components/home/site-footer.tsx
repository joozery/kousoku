'use client';

import { useState } from 'react';
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

const FOOTER_NAV = [
  { label: 'หน้าแรก', href: '#top' },
  { label: 'เกี่ยวกับเรา', href: '#about' },
  { label: 'สินค้า', href: '#products' },
  { label: 'บริการ', href: '#why-choose' },
  { label: 'ผลงาน/ลูกค้า', href: '#industries' },
  { label: 'ข่าวสาร', href: '#news' },
  { label: 'ติดต่อเรา', href: '#contact' },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-3.5 sm:h-3.5">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-3.5 sm:h-3.5">
      <path d="M12 2C6.48 2 2 5.69 2 10.24c0 4.08 3.54 7.5 8.32 8.14.32.07.76.22.87.5.1.26.06.66.03.92l-.14.85c-.04.26-.2 1 .88.54 1.07-.45 5.8-3.42 7.92-5.85C21.36 13.86 22 12.13 22 10.24 22 5.69 17.52 2 12 2Zm-3.6 10.9H6.7a.4.4 0 0 1-.4-.4V8.16a.4.4 0 1 1 .8 0v3.94h1.3a.4.4 0 1 1 0 .8Zm1.8 0a.4.4 0 0 1-.4-.4V8.16a.4.4 0 1 1 .8 0v4.34a.4.4 0 0 1-.4.4Zm4.9 0a.4.4 0 0 1-.32-.16l-2.02-2.75v2.51a.4.4 0 1 1-.8 0V8.16a.4.4 0 0 1 .72-.24l2.02 2.75V8.16a.4.4 0 1 1 .8 0v4.34a.4.4 0 0 1-.4.4Zm3.9-3.14a.4.4 0 1 1 0 .8h-1.3v.94h1.3a.4.4 0 1 1 0 .8h-1.7a.4.4 0 0 1-.4-.4V8.16a.4.4 0 0 1 .4-.4h1.7a.4.4 0 1 1 0 .8h-1.3v.94h1.3Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-3.5 sm:h-3.5">
      <path d="M21.8 8.1a2.75 2.75 0 0 0-1.94-1.95C18.2 5.7 12 5.7 12 5.7s-6.2 0-7.86.45A2.75 2.75 0 0 0 2.2 8.1 28.7 28.7 0 0 0 1.75 12a28.7 28.7 0 0 0 .45 3.9 2.75 2.75 0 0 0 1.94 1.95C5.8 18.3 12 18.3 12 18.3s6.2 0 7.86-.45a2.75 2.75 0 0 0 1.94-1.95c.3-1.28.45-2.6.45-3.9a28.7 28.7 0 0 0-.45-3.9ZM9.94 14.98V9.02L15.2 12l-5.26 2.98Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'Facebook', icon: FacebookIcon, hover: 'hover:bg-[#1877F2]' },
  { label: 'LINE', icon: LineIcon, hover: 'hover:bg-[#06C755]' },
  { label: 'YouTube', icon: YoutubeIcon, hover: 'hover:bg-[#FF0000]' },
];

export function SiteFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopyLine = () => {
    navigator.clipboard.writeText('@kousoku');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      id="contact"
      className="scroll-mt-16 relative overflow-hidden bg-gradient-to-b from-[#0e275c] via-[#0a1e48] to-[#071638] text-blue-100 text-xs"
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
            <a
              href="#top"
              className="inline-flex items-center rounded-md bg-white px-3 py-1.5 shadow-sm border border-white/20 hover:opacity-95 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/logokosoku.png"
                alt="KOUSOKU (THAILAND) CO., LTD."
                className="h-7.5 sm:h-8 w-auto object-contain"
              />
            </a>

            <p className="mt-3 text-sm sm:text-base font-bold text-white leading-snug">
              โลหะคุณภาพ เพื่ออุตสาหกรรม
              <span className="text-amber-400">ที่ยั่งยืน</span>
            </p>
            <p className="mt-1 text-[10px] sm:text-[10.5px] font-semibold tracking-wider text-blue-200/80 uppercase">
              Metal for a stronger tomorrow
            </p>

            <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-blue-200/90">
              <Clock size={12} className="text-amber-400 shrink-0" />
              <span>จันทร์ - เสาร์: 08:30 - 17:30 น.</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-blue-200/80 uppercase mb-2">
              ติดตามเรา
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
            <p className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">เมนูหลัก</p>
          </div>
          <ul className="space-y-1.5 sm:space-y-1.5">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group inline-flex items-center gap-1 py-0.5 text-[12px] sm:text-[12.5px] text-blue-100/90 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={12}
                    className="-ml-0.5 opacity-40 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                  />
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 3: Contact Info (Mobile: 1 col, Desktop: 3 cols) ── */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex items-center gap-1.5 mb-2.5 sm:mb-3">
            <span className="h-3 w-1 bg-amber-400" />
            <p className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">ติดต่อเรา</p>
          </div>
          <ul className="space-y-2.5 sm:space-y-3">
            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10 mt-0.5">
                <MapPin size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">ที่อยู่</span>
                <span className="block text-[11.5px] sm:text-[12px] text-blue-50 leading-snug">
                  75/33 หมู่ที่ 11 ต.คลองหนึ่ง อ.คลองหลวง จ.ปทุมธานี 12120
                </span>
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10">
                <Phone size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">โทรศัพท์</span>
                <a
                  href="tel:021234567"
                  className="block text-[11.5px] sm:text-[12px] text-blue-50 hover:text-amber-300 font-medium transition-colors"
                >
                  02-123-4567
                </a>
              </span>
            </li>

            <li className="flex items-start gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/10 text-amber-400 border border-white/10">
                <Mail size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold text-blue-200/80">อีเมล</span>
                <a
                  href="mailto:info@kousoku.co.th"
                  className="block text-[11.5px] sm:text-[12px] text-blue-50 hover:text-amber-300 transition-colors"
                >
                  info@kousoku.co.th
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* ── Col 4: LINE Smart Card (Mobile: full width, Desktop: 3 cols) ── */}
        <div className="sm:col-span-2 lg:col-span-3">
          <div className="rounded-lg bg-white/[0.06] p-3.5 sm:p-4 border border-white/15 backdrop-blur-sm shadow-lg">
            <p className="text-[11px] font-bold tracking-wider text-amber-400 uppercase mb-2">
              สอบถามผ่าน LINE
            </p>

            <p className="text-[11px] sm:text-[11.5px] text-blue-100/90 leading-snug">
              สแกน QR Code หรือแชทเพื่อขอใบเสนอราคาด่วน
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
                  title="คัดลอก LINE ID"
                >
                  {copied ? (
                    <>
                      <Check size={10} className="text-emerald-400" />
                      <span className="text-emerald-300">คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy size={10} className="text-blue-200" />
                      <span>@kousoku</span>
                    </>
                  )}
                </button>

                <a
                  href="https://line.me/ti/p/~kousoku"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-md bg-[#06C755] hover:bg-[#05b54d] active:scale-95 px-3 py-1.5 text-[11.5px] font-bold text-white shadow-sm transition-transform"
                >
                  <LineIcon />
                  <span>เพิ่มเพื่อน</span>
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
            © 2026 KOUSOKU (THAILAND) CO., LTD. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-3.5 sm:gap-4">
            <a href="#privacy" className="hover:text-white transition-colors py-1">
              Privacy Policy
            </a>
            <span aria-hidden className="h-2.5 w-px bg-white/20" />
            <a href="#terms" className="hover:text-white transition-colors py-1">
              Terms of Service
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="กลับขึ้นด้านบน"
              className="ml-1 grid h-7 w-7 place-items-center rounded-md bg-amber-400 text-blue-950 hover:bg-amber-300 active:scale-90 transition-all shadow-sm"
              title="กลับขึ้นด้านบน"
            >
              <ArrowUp size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
