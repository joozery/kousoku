'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MessageCircle, Phone, X } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/home-content';
import { LineIcon, FacebookIcon } from '@/components/home/brand-icons';

export function FloatingContact() {
  const t = useTranslations('floatingContact');
  const [open, setOpen] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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

  // Step out of the way once the footer's bottom bar is on screen — otherwise
  // the fixed button permanently sits on top of the copyright/back-to-top row.
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setNearFooter(entry.isIntersecting);
        if (entry.isIntersecting) setOpen(false);
      },
      { rootMargin: '0px 0px -120px 0px' }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const ITEMS = [
    { label: t('line'), href: CONTACT_INFO.lineUrl, icon: LineIcon, bg: 'bg-[#06C755]', external: true, iconClass: 'w-6 h-6' },
    { label: t('facebook'), href: CONTACT_INFO.facebookUrl, icon: FacebookIcon, bg: 'bg-[#1877F2]', external: true, iconClass: 'w-6 h-6' },
    { label: t('phone'), href: CONTACT_INFO.phoneHref, icon: Phone, bg: 'bg-blue-800', external: false, iconClass: 'w-5 h-5' },
  ];

  return (
    <div
      ref={boxRef}
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex flex-col items-end gap-3 transition-all duration-200 ${
        nearFooter ? 'opacity-0 translate-y-3 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Sub Buttons */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-200 ease-out ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {ITEMS.map(item => (
          <a
            key={item.label}
            href={item.href}
            {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={item.label}
            title={item.label}
            className={`group flex items-center rounded-full ${item.bg} text-white shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 shrink-0`}
          >
            {/* Icon wrapper: strictly 48x48 square, perfectly centering the icon */}
            <span className="flex h-12 w-12 items-center justify-center shrink-0">
              <item.icon className={`${item.iconClass} shrink-0`} />
            </span>

            {/* Label: expands smoothly on hover without distorting the circle when idle */}
            <span className="hidden sm:block max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold opacity-0 group-hover:max-w-[12rem] group-hover:opacity-100 group-hover:pr-4 group-hover:pl-0.5 transition-all duration-300 ease-out">
              {item.label}
            </span>
          </a>
        ))}
      </div>

      {/* Main Toggle Button: matched to 48x48 (h-12 w-12) for perfect vertical center alignment */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? t('close') : t('open')}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all shrink-0"
      >
        {open ? <X className="w-5 h-5 shrink-0" /> : <MessageCircle className="w-5 h-5 shrink-0" />}
      </button>
    </div>
  );
}
