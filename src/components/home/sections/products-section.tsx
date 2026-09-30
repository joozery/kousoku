'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowLeft, Search, ShieldCheck, Package, Truck, Settings, Building2, Factory, Zap, Cog, Landmark } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PRODUCTS } from '@/lib/home-content';

const IMAGES = ['/products/copper.jpg', '/products/steel-pipe.jpg', '/products/metal-supply.jpg', '/products/fittings.jpg'];
const COLORS = ['bg-orange-500', 'bg-blue-700', 'bg-slate-500', 'bg-sky-600'];
const CATALOG = [
  { key: 'copperTube', category: 0, english: 'Copper Tube', image: IMAGES[0] },
  { key: 'galvanizedPipe', category: 1, english: 'Galvanized Steel Pipe', image: IMAGES[1] },
  { key: 'steelPlate', category: 2, english: 'Steel Plate', image: IMAGES[2] },
  { key: 'steelAngle', category: 2, english: 'Steel Angle', image: IMAGES[2] },
  { key: 'flange', category: 3, english: 'Flange', image: IMAGES[3] },
  { key: 'steelPipe', category: 1, english: 'Steel Pipe', image: IMAGES[1] },
  { key: 'fittings', category: 3, english: 'Pipe Fittings', image: IMAGES[3] },
];
const BENEFITS = [ShieldCheck, Package, Truck, Settings];
const APPLICATIONS = [
  { key: 'construction', icon: Building2 }, { key: 'manufacturing', icon: Factory },
  { key: 'energy', icon: Zap }, { key: 'machinery', icon: Cog }, { key: 'infrastructure', icon: Landmark },
];
const shell = 'mx-auto max-w-7xl px-6 lg:px-10';
const card = 'overflow-hidden rounded-lg border border-slate-200/60 bg-white shadow-[0_3px_10px_rgba(15,45,85,0.06)]';
const smallLink = 'inline-flex min-h-9 items-center justify-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';

function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return <div><p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-blue-500">{eyebrow}<span aria-hidden="true" className="h-px w-12 bg-blue-200" /></p><h2 className="mt-2 text-2xl font-bold text-[#102452] lg:text-[30px]">{title}</h2>{subtitle && <p className="mt-2 text-sm leading-relaxed text-[#7585a2]">{subtitle}</p>}</div>;
}

export function ProductsSection() {
  const t = useTranslations('products');
  const p = useTranslations('productsPage');
  const ti = useTranslations('industries');
  const tn = useTranslations('news');
  const tc = useTranslations('common');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const articles = (tn.raw('items') as { title: string; date: string; image?: string }[]).slice(0, 3);
  const filtered = CATALOG.filter(item => (category === null || item.category === category) && `${p(`catalog.${item.key}.name`)} ${p(`catalog.${item.key}.description`)} ${item.english} ${t(`items.${PRODUCTS[item.category].key}.name`)}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));

  function showProducts(nextCategory: number | null) {
    setCategory(nextCategory);
    setQuery('');
    setSearch('');
    rail.current?.scrollTo({ left: 0 });
    document.getElementById('featured-products')?.scrollIntoView({ block: 'start' });
  }

  return (
    <main className="bg-[#f8fafc] text-[#102452]">
      <section className="relative isolate overflow-hidden bg-[#082846] text-white">
        <Image src="/cover/cover.png" alt="" fill preload sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#062342]/95 via-[#062342]/65 to-transparent" />
        <div className={`relative py-12 lg:py-14 ${shell}`}>
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-sky-200"><span className="h-px w-5 bg-sky-400" />PRODUCTS<span className="h-px w-12 bg-sky-300/40" /></p>
          <h1 className="mt-3 text-4xl font-bold lg:text-[46px]">{t('title')}</h1>
          <p className="mt-4 max-w-xl whitespace-pre-line text-base font-medium leading-relaxed text-blue-50">{p('intro')}</p>
          <form role="search" onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setCategory(null); rail.current?.scrollTo({ left: 0 }); document.getElementById('featured-products')?.scrollIntoView({ block: 'start' }); }} className="mt-6 flex max-w-xl items-center gap-3 rounded-md border border-blue-100 bg-white p-1.5 pl-4 shadow-lg">
            <Search size={19} className="shrink-0 text-[#8fa1c0]" aria-hidden="true" />
            <input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label={p('search')} placeholder={p('searchPlaceholder')} className="min-w-0 flex-1 rounded py-2 text-sm text-slate-700 outline-blue-500 placeholder:text-slate-400" />
            <button type="submit" className="min-h-10 rounded bg-blue-700 px-5 text-sm font-semibold text-white hover:bg-blue-800">{p('search')}</button>
          </form>
        </div>
      </section>

      <section className={`py-10 lg:py-12 ${shell}`}>
        <div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="PRODUCT CATEGORY" title={p('categoryTitle')} subtitle={p('categoryIntro')} /><button onClick={() => showProducts(null)} className={smallLink}>{t('viewAll')}<ArrowRight size={14} /></button></div>
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((item, index) => <article key={item.key} id={item.id} className={`group scroll-mt-24 ${card}`}>
            <div className="relative aspect-[1.55/1] overflow-hidden"><Image src={IMAGES[index]} alt={t(`items.${item.key}.name`)} fill sizes="(min-width: 1024px) 285px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
            <div className="relative px-5 pb-5"><span className={`-mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white text-white ${COLORS[index]}`}><item.icon size={24} strokeWidth={1.6} aria-hidden="true" /></span><h3 className="text-lg font-bold">{t(`items.${item.key}.name`)}</h3><p className="mt-1 min-h-12 text-sm leading-relaxed text-[#7585a2]">{t(`items.${item.key}.desc`)}</p><button onClick={() => showProducts(index)} className="mt-3 inline-flex min-h-9 items-center gap-2 rounded text-sm font-semibold text-blue-700 hover:text-blue-900">{p('viewProducts')}<ArrowRight size={15} /></button></div>
          </article>)}
        </div>
      </section>

      <section id="featured-products" className={`scroll-mt-24 pb-11 lg:pb-12 ${shell}`}>
        <div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="FEATURED PRODUCTS" title={search || category !== null ? p('resultsTitle') : p('featuredTitle')} subtitle={search ? p('searchResults', { query: search, count: filtered.length }) : category !== null ? t(`items.${PRODUCTS[category].key}.name`) : p('featuredIntro')} /><div className="flex items-center gap-3"><button onClick={() => showProducts(null)} className={smallLink}>{t('viewAll')}<ArrowRight size={14} /></button><div className="hidden gap-2 sm:flex">{[-1, 1].map(direction => <button key={direction} aria-label={direction < 0 ? p('previous') : p('next')} onClick={() => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })} className="grid h-9 w-9 place-items-center rounded-full border border-blue-300 text-blue-600 hover:bg-blue-100">{direction < 0 ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}</button>)}</div></div></div>
        <div ref={rail} role="region" aria-label={p('featuredTitle')} tabIndex={0} className="mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-3 focus-visible:outline-2 focus-visible:outline-blue-500">
          {filtered.map(item => <article key={item.key} className={`w-[78%] shrink-0 snap-start p-1.5 sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-80px)/5)] ${card}`}><div className="relative aspect-square overflow-hidden rounded"><Image src={item.image} alt={p(`catalog.${item.key}.name`)} fill sizes="(min-width: 1024px) 225px, (min-width: 640px) 50vw, 78vw" className="object-cover" /></div><div className="px-2.5 pt-4 pb-3"><h3 className="text-sm font-bold">{p(`catalog.${item.key}.name`)}</h3><p className="mt-1 text-xs text-[#7585a2]">{item.english}</p></div></article>)}
        </div>
        {filtered.length === 0 && <div role="status" className="rounded-xl border border-blue-100 bg-white p-8 text-center"><p className="text-slate-600">{p('empty')}</p><button onClick={() => showProducts(null)} className={`mt-4 ${smallLink}`}>{t('viewAll')}</button></div>}
      </section>

      <section className="relative isolate overflow-hidden bg-[#052449] text-white">
        <Image src="/products/steel-pipe.jpg" alt="" fill sizes="100vw" className="object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#032248] via-[#032248]/95 to-[#032248]/15" />
        <div className={`relative py-12 lg:py-14 ${shell}`}><p className="text-[10px] font-bold tracking-[0.22em] text-sky-200">WHY CHOOSE US</p><h2 className="mt-3 text-2xl font-bold lg:text-3xl">{p('whyTitle')}</h2><div className="mt-7 grid max-w-2xl gap-6 sm:grid-cols-2">{BENEFITS.map((Icon, index) => <div key={index} className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-500/20"><Icon size={28} strokeWidth={1.6} aria-hidden="true" /></span><div><h3 className="text-base font-bold">{p(`benefits.${index}.title`)}</h3><p className="mt-1 text-xs leading-relaxed text-blue-100">{p(`benefits.${index}.description`)}</p></div></div>)}</div></div>
      </section>

      <section className={`py-11 lg:py-12 ${shell}`}><Heading eyebrow="APPLICATIONS" title={ti('title')} subtitle={p('applicationsIntro')} /><div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{APPLICATIONS.map(({ key, icon: Icon }) => <Link href="/industries" key={key} className={`group transition-shadow hover:shadow-md ${card}`}><div className="relative aspect-[1.4/1]"><Image src={`/industries/${key}.jpg`} alt={ti(`items.${key}`)} fill sizes="(min-width: 1024px) 225px, (min-width: 640px) 50vw, 100vw" className="object-cover" /></div><div className="relative px-4 pb-4"><span className="-mt-5 mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600"><Icon size={23} aria-hidden="true" /></span><h3 className="text-sm font-bold group-hover:text-blue-600">{ti(`items.${key}`)}</h3><p className="mt-1 text-xs leading-relaxed text-[#7585a2]">{p(`applications.${key}`)}</p></div></Link>)}</div></section>

      <section className="relative isolate overflow-hidden bg-blue-50"><Image src="/products/fittings.jpg" alt="" fill sizes="100vw" className="object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-[#eaf3ff] via-[#eaf3ff]/95 to-[#eaf3ff]/10" /><div className={`relative py-11 lg:py-12 ${shell}`}><h2 className="max-w-md whitespace-pre-line text-3xl font-bold leading-tight">{p('customTitle')}</h2><p className="mt-3 max-w-md text-sm leading-relaxed text-[#405980]">{p('customIntro')}</p><Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-full bg-blue-700 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-800">{tc('requestQuote')}<ArrowRight size={16} /></Link></div></section>

      <section className={`pt-11 pb-14 lg:pt-12 lg:pb-16 ${shell}`}><div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="KNOWLEDGE" title={p('knowledgeTitle')} /><Link href="/news" className={smallLink}>{p('allArticles')}<ArrowRight size={14} /></Link></div><div className="mt-6 grid gap-5 sm:grid-cols-3">{articles.map((article, index) => <Link href="/news" key={article.title} className={`group ${card}`}><div className="relative aspect-[2.35/1]"><Image src={article.image || IMAGES[index]} alt="" fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" /></div><div className="p-4"><h3 className="text-sm font-bold leading-relaxed group-hover:text-blue-600">{article.title}</h3><p className="mt-3 text-xs text-[#7585a2]">{article.date}</p></div></Link>)}</div></section>

    </main>
  );
}
