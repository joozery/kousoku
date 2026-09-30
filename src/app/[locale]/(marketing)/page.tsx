import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HeroSection } from '@/components/home/sections/hero-section';
import { AboutTeaser } from '@/components/home/teasers/about-teaser';
import { ProductsTeaser } from '@/components/home/teasers/products-teaser';
import { ServicesTeaser } from '@/components/home/teasers/services-teaser';
import { IndustriesTeaser } from '@/components/home/teasers/industries-teaser';
import { NewsTeaser } from '@/components/home/teasers/news-teaser';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.home' });
  return { title: t('title'), description: t('description') };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutTeaser />
      <ProductsTeaser />
      <ServicesTeaser />
      <IndustriesTeaser />
      <NewsTeaser />
    </>
  );
}
