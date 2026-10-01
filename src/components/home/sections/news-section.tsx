'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft, CalendarDays, Search, BookOpen, Mail } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type NewsItem = { date: string; title: string; excerpt?: string; category?: string; image?: string };
const FILTERS = ['all', 'company', 'knowledge', 'market', 'events', 'press'] as const;
type Category = typeof FILTERS[number];
const CATEGORY_KEYS: Record<string, Category> = { 'ข่าวบริษัท': 'company', 'Company News': 'company', 'お知らせ': 'company', 'ความรู้': 'knowledge', 'Knowledge': 'knowledge', '知識': 'knowledge', 'วิเคราะห์ตลาด': 'market', 'Market Analysis': 'market', '市場分析': 'market' };
const BADGES: Record<string, string> = { company: 'bg-blue-700', knowledge: 'bg-slate-500', market: 'bg-sky-500', events: 'bg-violet-600', press: 'bg-blue-500' };
const shell = 'mx-auto max-w-7xl px-6 lg:px-10';

export function NewsSection() {
  const t = useTranslations('news');
  const p = useTranslations('newsPage');
  const [category, setCategory] = useState<Category>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [newsletterNotice, setNewsletterNotice] = useState(false);
  const existing = t.raw('items') as NewsItem[];
  const extra = (p.raw('articles') as NewsItem[]).map(item => ({ ...item, category: p('filters.knowledge') }));
  const items = [...existing, ...extra];
  const getCategory = (item: NewsItem): Category => CATEGORY_KEYS[item.category || ''] || (item.category === p('filters.knowledge') ? 'knowledge' : 'press');
  const filtered = items.filter(item => (category === 'all' || getCategory(item) === category) && `${item.title} ${item.excerpt || ''} ${item.category || ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const visible = filtered.slice((page - 1) * 5, page * 5);

  return (
    <main className="bg-[#f8fafc] text-[#102657]">
      <section className="relative isolate overflow-hidden bg-[#08284b] text-white">
        <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05274e]/95 via-[#05274e]/65 to-transparent" />
        <div className={`relative py-12 lg:py-14 ${shell}`}>
          <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-sky-200"><span className="h-px w-7 bg-sky-300/70" />NEWS &amp; UPDATES<span className="h-px w-8 bg-sky-300/40" /></p>
          <h1 className="mt-3 text-4xl font-bold leading-tight lg:text-[44px]">{p('title')}</h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-base leading-relaxed text-blue-50">{p('intro')}</p>
        </div>
      </section>

      <section aria-label={p('title')} className={`pt-6 pb-10 ${shell}`}>
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div role="group" aria-label={p('filterLabel')} className="flex flex-wrap gap-2">
            {FILTERS.map(key => <button key={key} type="button" aria-pressed={category === key} onClick={() => { setCategory(key); setPage(1); }} className={`min-h-10 rounded-full px-4 py-2 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${category === key ? 'bg-blue-700 text-white' : 'bg-blue-50 text-[#142c5b] hover:bg-blue-100'}`}>{p(`filters.${key}`)}</button>)}
          </div>
          <div role="search" className="flex items-center gap-3 rounded-full border border-blue-100 bg-white px-4 xl:w-72 xl:shrink-0"><Search size={17} aria-hidden="true" className="shrink-0 text-[#8093b6]" /><input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} aria-label={p('search')} placeholder={p('search')} className="min-h-10 min-w-0 flex-1 rounded-full bg-transparent text-sm text-slate-700 outline-blue-500 placeholder:text-[#8093b6]" /></div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2.9fr)_minmax(240px,1fr)]">
          <div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-6">
              {visible.map((item, index) => (
                <article key={item.title} className={`flex flex-col overflow-hidden rounded-lg border border-slate-200/70 bg-white shadow-[0_2px_5px_rgba(15,45,85,0.06)] ${index === 0 ? 'sm:col-span-2 xl:col-span-4' : 'xl:col-span-2'}`}>
                  <button type="button" onClick={() => setSelected(item)} aria-label={item.title} className={`relative block w-full overflow-hidden text-left ${index < 2 ? 'h-48' : 'h-40'}`}>
                    <Image src={item.image || '/cover/why-ksk-bg.jpg'} alt="" fill sizes={index === 0 ? '(min-width: 1280px) 580px, (min-width: 640px) 70vw, 100vw' : '(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw'} className="object-cover transition-transform duration-500 motion-safe:hover:scale-105" />
                    <span className={`absolute bottom-0 left-4 rounded-t-md px-3 py-1.5 text-[10px] font-semibold text-white ${BADGES[getCategory(item)]}`}>{item.category}</span>
                  </button>
                  <div className="flex flex-1 flex-col p-5">
                    {item.date && <p className="flex items-center gap-1.5 text-[11px] text-[#8293b3]"><CalendarDays size={12} aria-hidden="true" />{item.date}</p>}
                    <h2 className={`mt-2 font-bold leading-snug ${index === 0 ? 'text-xl lg:text-2xl' : 'text-base'}`}>{item.title}</h2>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#7486a7]">{item.excerpt}</p>
                    <button type="button" onClick={() => setSelected(item)} className="mt-auto inline-flex min-h-10 items-center gap-2 self-start rounded pt-4 text-sm font-semibold text-blue-700 hover:text-blue-900">{p('readMore')}<ArrowRight size={15} aria-hidden="true" /></button>
                  </div>
                </article>
              ))}
            </div>
            {visible.length === 0 && <div role="status" className="rounded-xl border border-blue-100 bg-white px-6 py-14 text-center"><Search size={32} aria-hidden="true" className="mx-auto mb-4 text-blue-300" /><h2 className="text-lg font-semibold">{p('empty')}</h2><p className="mt-2 text-sm text-slate-500">{p('emptyHint')}</p><button onClick={() => { setCategory('all'); setQuery(''); setPage(1); }} className="mt-5 rounded-full bg-blue-700 px-5 py-2 text-sm text-white hover:bg-blue-800">{p('filters.all')}</button></div>}
            {visible.length > 0 && <nav aria-label={p('pagination')} className="mt-6 flex items-center justify-center gap-3"><button aria-label={p('previous')} disabled={page === 1} onClick={() => setPage(value => value - 1)} className="grid h-9 w-9 place-items-center rounded-full border border-blue-200 text-blue-600 disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft size={16} /></button>{Array.from({ length: pages }, (_, index) => <button key={index} aria-current={page === index + 1 ? 'page' : undefined} aria-label={p('page', { number: index + 1 })} onClick={() => setPage(index + 1)} className={`h-9 w-9 rounded-full text-sm ${page === index + 1 ? 'bg-blue-700 text-white' : 'border border-blue-100 text-blue-950'}`}>{index + 1}</button>)}<button aria-label={p('next')} disabled={page === pages} onClick={() => setPage(value => value + 1)} className="grid h-9 w-9 place-items-center rounded-full border border-blue-200 text-blue-600 disabled:cursor-not-allowed disabled:opacity-35"><ArrowRight size={16} /></button></nav>}
          </div>

          <aside className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <section className="rounded-xl bg-[#eef5ff] p-5"><h2 className="flex items-center gap-2 text-lg font-bold"><BookOpen size={21} aria-hidden="true" className="text-blue-600" />{p('recommended')}</h2><ul className="mt-4 space-y-4">{items.slice(0, 4).map(item => <li key={item.title}><button type="button" onClick={() => setSelected(item)} className="group flex w-full items-start gap-3 rounded text-left"><span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-md"><Image src={item.image || '/products/steel-pipe.jpg'} alt="" fill sizes="72px" className="object-cover" /></span><span><span className="line-clamp-2 text-xs font-semibold leading-relaxed group-hover:text-blue-600">{item.title}</span>{item.date && <span className="mt-2 flex items-center gap-1 text-[10px] text-[#8093b4]"><CalendarDays size={11} aria-hidden="true" />{item.date}</span>}</span></button></li>)}</ul></section>
            <section className="relative isolate overflow-hidden rounded-xl bg-blue-950 px-5 py-11 text-white"><Image src="/company-profile/pneumatic-page.jpg" alt="" fill sizes="350px" className="object-cover object-[65%_center]" /><div className="absolute inset-0 bg-gradient-to-r from-[#082e63] via-[#082e63]/85 to-[#082e63]/10" /><div className="relative"><h2 className="text-xl font-bold leading-snug">{p('contactTitle')}</h2><p className="mt-3 text-sm leading-relaxed text-blue-50">{p('contactIntro')}</p><Link href="/contact" className="mt-7 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-blue-700 hover:bg-blue-50">{p('contact')}<ArrowRight size={14} /></Link></div></section>
          </aside>
        </div>
      </section>

      <section className="relative isolate overflow-hidden rounded-t-xl bg-[#073064] text-white"><Image src="/company-profile/electrical-equipment.png" alt="" fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#042650] via-[#0a3972]/95 to-[#18549a]/65" /><div className={`relative grid items-center gap-7 py-9 lg:grid-cols-[1.3fr_1fr] lg:py-10 ${shell}`}><div><p className="text-[10px] font-semibold tracking-[0.25em] text-sky-200">STAY UPDATED</p><h2 className="mt-2 text-3xl font-bold">{p('newsletterTitle')}</h2><p className="mt-2 text-sm leading-relaxed text-blue-50">{p('newsletterIntro')}</p></div><form onSubmit={event => { event.preventDefault(); setNewsletterNotice(true); }}><div className="flex flex-col gap-3 sm:flex-row"><label className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-md bg-white px-4"><Mail size={18} aria-hidden="true" className="shrink-0 text-[#8194b4]" /><span className="sr-only">{p('email')}</span><input type="email" name="email" required autoComplete="email" placeholder={p('email')} className="min-w-0 flex-1 py-3 text-sm text-slate-700 outline-blue-500 placeholder:text-[#8194b4]" /></label><button className="min-h-11 shrink-0 rounded-lg border-4 border-blue-200/70 bg-blue-700 px-5 text-sm font-semibold hover:bg-blue-800">{p('subscribe')}<ArrowRight size={14} aria-hidden="true" className="ml-2 inline" /></button></div><label className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-blue-50"><input type="checkbox" required className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600" />{p('consent')}</label>{newsletterNotice && <p role="status" className="mt-3 rounded-md bg-white/15 p-3 text-sm leading-relaxed">{p('newsletterUnavailable')} <Link href="/contact" className="font-semibold underline">{p('contact')}</Link></p>}</form></div></section>

      <Dialog open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">{selected && <><div className="relative mt-5 aspect-[2/1] overflow-hidden rounded-lg"><Image src={selected.image || '/cover/cover.png'} alt="" fill sizes="650px" className="object-cover" /></div><p className="text-xs text-slate-500">{selected.category}{selected.date && ` · ${selected.date}`}</p><DialogTitle className="text-xl font-bold leading-relaxed text-[#102657]">{selected.title}</DialogTitle><DialogDescription className="text-base leading-relaxed text-slate-600">{selected.excerpt}</DialogDescription><Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">{p('contact')}<ArrowRight size={15} /></Link></>}</DialogContent></Dialog>
    </main>
  );
}
