import { getBrands } from '@/app/actions/brands';
import { getProductTypes } from '@/app/actions/productTypes';
import { BrandsClient } from '@/components/admin/brands-client';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'จัดการแบรนด์ | Admin' };

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const productTypes = await getProductTypes();
  const requestedType = type || 'general';
  const activeType = productTypes.some(item => item.key === requestedType)
    ? requestedType
    : productTypes[0]?.key ?? 'general';
  if (type && type !== activeType) redirect(`/admin/brands?type=${activeType}`);
  const brands = await getBrands(activeType);
  return <BrandsClient initialBrands={brands} initialProductTypes={productTypes} activeType={activeType} />;
}
