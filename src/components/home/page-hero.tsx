import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

export function PageHero({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const t = useTranslations('common');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 to-blue-900 text-white py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center gap-1.5 text-xs text-blue-200">
          <Link href="/" className="hover:text-white transition-colors">
            {t('breadcrumbHome')}
          </Link>
          <ChevronRight size={12} />
          <span className="text-white font-semibold">{title}</span>
        </div>

        <p className="mt-4 text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-2xl lg:text-3xl font-bold">{title}</h1>
      </div>
    </section>
  );
}
