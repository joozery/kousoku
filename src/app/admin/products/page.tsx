import { getAllProductsAdmin } from '@/lib/products';
import { getBrands } from '@/app/actions/brands';
import { getCategories } from '@/app/actions/categories';
import { getProductTypes } from '@/app/actions/productTypes';
import { ProductsClient } from '@/components/admin/products-client';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const productTypes = await getProductTypes();
  const requestedType = type || 'general';
  const productType = productTypes.some(item => item.key === requestedType)
    ? requestedType
    : productTypes[0]?.key ?? 'general';
  if (type && type !== productType) redirect(`/admin/products?type=${productType}`);
  const [products, brands, categories] = await Promise.all([
    getAllProductsAdmin(productType),
    getBrands(productType),
    getCategories(productType),
  ]);
  return (
    <ProductsClient
      initialProducts={products}
      initialBrands={brands}
      initialCategories={categories}
      initialProductTypes={productTypes}
      activeType={productType}
    />
  );
}
