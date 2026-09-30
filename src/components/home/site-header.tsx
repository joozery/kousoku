'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Menu, X, Search, UserRound, ChevronRight, ChevronDown, Globe, Check } from 'lucide-react';
import { NAV_ITEMS, SEARCH_ENTRIES } from '@/lib/home-content';
import { ProductMegaMenu } from '@/components/home/product-mega-menu';
import { NavBackdrop } from '@/components/home/nav-backdrop';

const LOCALES = [
  { code: 'th', label: 'ไทย' },
  { code: 'en', label: 'English' },
  { code: 'ja', label: '日本語' },
] as const;

function LogoMark() {
  return (
    <Link href="/" className="flex items-center min-w-0 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logokosoku.png" alt="KOUSOKU (THAILAND) CO., LTD." className="h-8 sm:h-9 w-auto object-contain" />
    </Link>
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[number];
  active: boolean;
  onClick?: () => void;
}) {
  const t = useTranslations('nav');
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`relative py-2 text-sm font-semibold transition-colors ${active ? 'text-blue-800' : 'text-slate-600 hover:text-blue-800'}`}
    >
      {t(item.key)}
      <span
        className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-blue-700 transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </Link>
  );
}

function LanguageSwitcher({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const current = LOCALES.find(l => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const isMobile = variant === 'mobile';

  return (
    <div ref={boxRef} className={`relative ${isMobile ? 'w-full' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 rounded-full border border-slate-200 text-slate-600 hover:text-blue-800 hover:border-blue-200 transition-colors ${
          isMobile ? 'w-full justify-between px-3.5 py-2.5' : 'px-3 py-2 text-sm'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Globe size={15} className="text-slate-400" />
          <span className="text-sm font-semibold">{current.label}</span>
        </span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute z-20 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg ${
            isMobile ? 'left-0 right-0 top-full mt-2' : 'right-0 top-full mt-2 w-40'
          }`}
        >
          {LOCALES.map(l => (
            <Link
              key={l.code}
              href={pathname}
              locale={l.code}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                locale === l.code ? 'text-blue-800 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-800'
              }`}
            >
              {l.label}
              {locale === l.code && <Check size={14} />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function SearchBox() {
  const t = useTranslations('search');
  const tItems = useTranslations('search.items');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? SEARCH_ENTRIES.map(entry => ({
        ...entry,
        label: tItems(`${entry.key}.label`),
        keywords: tItems(`${entry.key}.keywords`),
      })).filter(item =>
        `${item.label} ${item.keywords}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : [];

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  function goTo(href: string) {
    setOpen(false);
    setQuery('');
    router.push(href);
  }

  return (
    <div ref={boxRef} className="relative flex items-center">
      <div
        className={`flex items-center overflow-hidden rounded-full border transition-all duration-200 ${
          open ? 'w-56 border-slate-200 bg-slate-50 px-3' : 'w-9 border-transparent'
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={t('ariaLabel')}
          className="grid h-9 w-9 shrink-0 place-items-center text-slate-400 hover:text-blue-800 transition-colors"
        >
          <Search size={17} />
        </button>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && results[0]) goTo(results[0].href);
          }}
          placeholder={t('placeholder')}
          className={`bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none transition-opacity duration-150 ${
            open ? 'opacity-100 w-full ml-1' : 'opacity-0 w-0'
          }`}
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-100 bg-white py-1.5 shadow-lg z-20">
          {results.map(r => (
            <button
              key={r.label}
              onClick={() => goTo(r.href)}
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-800 transition-colors"
            >
              {r.label}
              <ChevronRight size={14} className="text-slate-300" />
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-100 bg-white py-3 px-4 text-sm text-slate-400 shadow-lg z-20">
          {t('noResults', { query })}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background scroll while the mobile menu is open, so it reads as a
  // proper full overlay instead of a dropdown with page content peeking below it.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  function openMega() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMegaOpen(true);
  }

  function closeMegaWithDelay() {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120);
  }

  return (
    <>
    <header
      className={`sticky top-0 z-50 bg-white border-b border-slate-200 transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_2px_16px_-4px_rgba(15,23,42,0.12)]' : ''
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6 transition-[height] duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>
        <LogoMark />

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map(item =>
            item.key === 'products' ? (
              <div key={item.href} onMouseEnter={openMega} onMouseLeave={closeMegaWithDelay}>
                <NavLink item={item} active={pathname === item.href} onClick={() => setMegaOpen(false)} />
                <ProductMegaMenu open={megaOpen} onNavigate={() => setMegaOpen(false)} />
              </div>
            ) : (
              <NavLink key={item.href} item={item} active={pathname === item.href} />
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <SearchBox />
          <LanguageSwitcher />
          <Link
            href="/contact#quote-form"
            className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
          >
            <UserRound size={16} />
            {tc('requestQuote')}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="lg:hidden p-2 text-blue-950 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={open ? tc('closeMenu') : tc('openMenu')}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu Overlay (Floats on top, does NOT push hero section) ── */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/80 shadow-2xl transition-all duration-200 ease-out z-50 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto visible'
            : 'opacity-0 -translate-y-2 pointer-events-none invisible'
        }`}
      >
        <div className="px-5 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors border-b border-slate-50 last:border-0 ${
                pathname === item.href ? 'text-blue-800 bg-blue-50/70 font-bold' : 'text-slate-600 hover:text-blue-800'
              }`}
            >
              <span>{t(item.key)}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </Link>
          ))}

          <div className="pt-2">
            <LanguageSwitcher variant="mobile" />
          </div>

          <Link
            href="/contact#quote-form"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-bold text-sm px-5 py-3 rounded-full transition-all shadow-md shadow-blue-900/15"
          >
            <UserRound size={16} />
            {tc('requestQuote')}
          </Link>
        </div>
      </div>
    </header>

    <NavBackdrop open={megaOpen || open} onClose={() => { setMegaOpen(false); setOpen(false); }} />
    </>
  );
}
