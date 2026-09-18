'use server';

import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import { ProductCategory } from '@/models/ProductCategory';

export type CategoryRow = { id: string; key: string; label: string; productType: string };

const GENERAL_DEFAULTS: Omit<CategoryRow, 'id'>[] = [
  { key: 'general',   label: 'ทั่วไป',              productType: 'general' },
  { key: 'premium',   label: 'พรีเมียม',             productType: 'general' },
  { key: 'accessory', label: 'อุปกรณ์เสริม',          productType: 'general' },
];

export async function getCategories(productType: string): Promise<CategoryRow[]> {
  await connectDB();
  let docs = await ProductCategory.find({ productType }).sort({ createdAt: 1 }).lean();
  if (docs.length === 0 && productType === 'general') {
    await ProductCategory.insertMany(GENERAL_DEFAULTS);
    docs = await ProductCategory.find({ productType }).sort({ createdAt: 1 }).lean();
  }
  return docs.map(d => ({
    id:          String(d._id),
    key:         d.key as string,
    label:       d.label as string,
    productType: d.productType as string,
  }));
}

export async function createCategory(productType: string, key: string, label: string): Promise<{ ok?: boolean; error?: string }> {
  key   = key.trim().toLowerCase().replace(/\s+/g, '_');
  label = label.trim();
  if (!key || !label) return { error: 'กรุณากรอกข้อมูลให้ครบ' };
  try {
    await connectDB();
    const exists = await ProductCategory.findOne({ key, productType });
    if (exists) return { error: `หมวดหมู่ "${key}" มีอยู่แล้ว` };
    await ProductCategory.create({ key, label, productType });
    revalidatePath('/admin/products');
    return { ok: true };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function deleteCategory(id: string): Promise<{ ok?: boolean; error?: string }> {
  try {
    await connectDB();
    await ProductCategory.findByIdAndDelete(id);
    revalidatePath('/admin/products');
    return { ok: true };
  } catch (e) {
    return { error: String(e) };
  }
}
