import { useTranslations } from 'next-intl';
import { ArrowRight, ArrowUpRight, Clock, Tag } from 'lucide-react';
import { Link } from '@/i18n/navigation';

type NewsItem = {
  date: string;
  title: string;
  excerpt?: string;
  category?: string;
  readMin?: number;
  image?: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  'วิเคราะห์ตลาด':  'bg-violet-100 text-violet-700',
  'Market Analysis': 'bg-violet-100 text-violet-700',
  '市場分析':        'bg-violet-100 text-violet-700',
  'ข่าวบริษัท':     'bg-sky-100 text-sky-700',
  'Company News':   'bg-sky-100 text-sky-700',
  'お知らせ':       'bg-sky-100 text-sky-700',
  'ความรู้':        'bg-emerald-100 text-emerald-700',
  'Knowledge':      'bg-emerald-100 text-emerald-700',
  '知識':           'bg-emerald-100 text-emerald-700',
};

function CategoryBadge({ cat }: { cat?: string }) {
  if (!cat) return null;
  const cls = CATEGORY_COLORS[cat] ?? 'bg-slate-100 text-slate-600';
  return (
    <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold ${cls}`}>
      <Tag size={9} />
      {cat}
    </span>
  );
}

function ReadTime({ min, label }: { min?: number; label: string }) {
  if (!min) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
      <Clock size={11} />
      {min} {label}
    </span>
  );
}

/* ─── Hero card ──────────────────────────────────────────────── */
function HeroCard({ item, badge, viewAll, readMinLabel }: {
  item: NewsItem;
  badge: string;
  viewAll: string;
  readMinLabel: string;
}) {
  return (
    <Link
      href="/news"
      className="group relative flex flex-col overflow-hidden rounded-xl bg-blue-950 text-white shadow-xl shadow-blue-950/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300 min-h-[360px] lg:min-h-[420px]"
    >
      {/* Background photo */}
      {item.image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
          />
          {/* Gradient overlay darkens bottom for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-950/50 to-blue-900/20" />
        </>
      )}

      {/* Content */}
      <div className="relative flex flex-col flex-1 p-7">
        {/* Badges at top */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-amber-400 text-blue-950 text-[11px] font-black uppercase tracking-wider px-2.5 py-1">
            {badge}
          </span>
          <CategoryBadge cat={item.category} />
        </div>

        {/* Content anchored bottom */}
        <div className="mt-auto pt-8">
          <div className="mb-3 w-8 h-0.5 bg-amber-400/80" />
          <time className="text-xs text-blue-300/80 font-medium">{item.date}</time>
          <h3 className="mt-2 text-xl lg:text-2xl font-bold leading-snug text-white group-hover:text-amber-100 transition-colors line-clamp-3">
            {item.title}
          </h3>
          {item.excerpt && (
            <p className="mt-3 text-sm text-blue-200/65 leading-relaxed line-clamp-2">
              {item.excerpt}
            </p>
          )}
          <div className="mt-5 flex items-center justify-between">
            <ReadTime min={item.readMin} label={readMinLabel} />
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
              {viewAll}
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Small card ──────────────────────────────────────────────── */
function SmallCard({ item, readMinLabel }: { item: NewsItem; readMinLabel: string }) {
  return (
    <Link
      href="/news"
      className="group flex items-stretch overflow-hidden rounded-xl border border-slate-150 bg-white shadow-sm hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Thumbnail image */}
      {item.image && (
        <div className="w-28 shrink-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {/* Fallback accent bar when no image */}
      {!item.image && (
        <div className="w-1 shrink-0 bg-gradient-to-b from-blue-700 to-blue-400" />
      )}

      <div className="flex flex-col flex-1 min-w-0 p-4">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <CategoryBadge cat={item.category} />
          <ReadTime min={item.readMin} label={readMinLabel} />
        </div>
        <p className="text-sm font-bold text-blue-950 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {item.title}
        </p>
        {item.excerpt && (
          <p className="mt-1 text-xs text-slate-400 line-clamp-1 leading-relaxed">{item.excerpt}</p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <time className="text-[11px] font-medium text-slate-400">{item.date}</time>
          <ArrowRight size={14} className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Section ──────────────────────────────────────────────────── */
export function NewsTeaser() {
  const t = useTranslations('news');
  const items = t.raw('items') as NewsItem[];
  const [hero, ...secondary] = items;

  return (
    <section id="news" className="scroll-mt-16 py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-px w-7 bg-blue-600" />
              <span className="text-xs font-bold tracking-[0.25em] text-blue-600 uppercase">
                {t('eyebrow')}
              </span>
            </div>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-blue-950">{t('title')}</h2>
          </div>
          <Link
            href="/news"
            className="group shrink-0 inline-flex items-center gap-1.5 rounded border border-blue-200 hover:bg-blue-700 hover:border-blue-700 text-blue-700 hover:text-white px-4 py-2 text-sm font-bold transition-all duration-200"
          >
            {t('viewAll')}
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-5">

          {hero && (
            <HeroCard
              item={hero}
              badge={t('latestBadge')}
              viewAll={t('viewAll')}
              readMinLabel={t('readMin')}
            />
          )}

          <div className="flex flex-col gap-4">
            {secondary.slice(0, 3).map(item => (
              <SmallCard key={item.title} item={item} readMinLabel={t('readMin')} />
            ))}

            {/* CTA bar */}
            <div className="mt-auto rounded-xl bg-gradient-to-r from-blue-950 to-blue-800 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-1">KOUSOKU (THAILAND)</p>
                <p className="text-white font-bold text-sm leading-snug">
                  {t('ctaHeading1')} <span className="text-amber-300">{t('ctaHeading2')}</span>
                </p>
              </div>
              <Link
                href="/contact"
                className="shrink-0 inline-flex items-center gap-1.5 rounded bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-5 py-2.5 text-sm transition-colors"
              >
                {t('ctaButton')} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
