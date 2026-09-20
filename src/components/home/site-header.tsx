'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X, Search, UserRound, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'หน้าแรก', href: '#top' },
  { label: 'เกี่ยวกับเรา', href: '#about' },
  { label: 'สินค้า', href: '#products' },
  { label: 'บริการ', href: '#why-choose' },
  { label: 'ผลงาน/ลูกค้า', href: '#industries' },
  { label: 'ข่าวสาร', href: '#news' },
  { label: 'ติดต่อเรา', href: '#contact' },
];

const SEARCH_INDEX = [
  { label: 'หน้าแรก', href: '#top', keywords: 'home หน้าแรก' },
  { label: 'เกี่ยวกับเรา', href: '#about', keywords: 'about us เกี่ยวกับเรา บริษัท' },
  { label: 'ทองแดง (Copper)', href: '#products', keywords: 'copper ทองแดง ท่อทองแดง' },
  { label: 'ท่อเหล็ก (Steel Pipe)', href: '#products', keywords: 'steel pipe ท่อเหล็ก เหล็กชุบสังกะสี สแตนเลส' },
  { label: 'วัสดุโลหะ (Metal Supply)', href: '#products', keywords: 'metal supply เหล็กแผ่น เหล็กฉาก เพลท' },
  { label: 'อุปกรณ์ข้อต่อ (Fitting & Accessories)', href: '#products', keywords: 'fitting accessories ข้อต่อ สามทาง หน้าแปลน' },
  { label: 'ทำไมต้องเลือก KSK', href: '#why-choose', keywords: 'why choose ksk บริการ' },
  { label: 'อุตสาหกรรมที่เราให้บริการ', href: '#industries', keywords: 'industries อุตสาหกรรม ก่อสร้าง พลังงาน ยานยนต์' },
  { label: 'ข่าวสารและบทความ', href: '#news', keywords: 'news update ข่าวสาร บทความ' },
  { label: 'ติดต่อเรา', href: '#contact', keywords: 'contact ติดต่อ ที่อยู่ เบอร์โทร' },
];

function LogoMark() {
  return (
    <a href="#top" className="flex items-center min-w-0 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo/logokosoku.png" alt="KOUSOKU (THAILAND) CO., LTD." className="h-8 sm:h-9 w-auto object-contain" />
    </a>
  );
}

function NavLink({ item, active }: { item: (typeof NAV_ITEMS)[number]; active: boolean }) {
  return (
    <a
      href={item.href}
      className={`relative py-2 text-sm font-semibold transition-colors ${active ? 'text-blue-800' : 'text-slate-600 hover:text-blue-800'}`}
    >
      {item.label}
      <span
        className={`absolute left-0 -bottom-0.5 h-[2px] w-full origin-left rounded-full bg-blue-700 transition-transform duration-200 ${
          active ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </a>
  );
}

function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = query.trim()
    ? SEARCH_INDEX.filter(item =>
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
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
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
          aria-label="ค้นหา"
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
          placeholder="ค้นหาสินค้า, บริการ..."
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
          ไม่พบผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('#top');

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS
      .map(item => document.querySelector(item.href))
      .filter((el): el is Element => el !== null);

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting);
        if (visible) setActiveHref(`#${visible.target.id}`);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_2px_16px_-4px_rgba(15,23,42,0.12)]' : 'border-b border-slate-100'
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between gap-6 transition-[height] duration-200 ${scrolled ? 'h-14' : 'h-16'}`}>
        <LogoMark />

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_ITEMS.map(item => (
            <NavLink key={item.href} item={item} active={activeHref === item.href} />
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <SearchBox />
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all whitespace-nowrap"
          >
            <UserRound size={16} />
            ขอใบเสนอราคา
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="lg:hidden p-2 text-blue-950 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
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
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors border-b border-slate-50 last:border-0 ${
                activeHref === item.href ? 'text-blue-800 bg-blue-50/70 font-bold' : 'text-slate-600 hover:text-blue-800'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight size={16} className="text-slate-300" />
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-3 flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 active:scale-95 text-white font-bold text-sm px-5 py-3 rounded-full transition-all shadow-md shadow-blue-900/15"
          >
            <UserRound size={16} />
            ขอใบเสนอราคา
          </a>
        </div>
      </div>
    </header>
  );
}
