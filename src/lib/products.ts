import connectDB from './mongodb';
import { Product, IProduct } from '@/models/Product';

export type ProductRow = IProduct & { id: string };

function normalize(doc: Record<string, unknown>): ProductRow {
  const { _id, __v, ...rest } = doc;
  return { id: String(_id), ...rest } as unknown as ProductRow;
}
export async function getProducts(filters?: {
  brand?: string;
  category?: string;
  size?: string;
  productType?: string;
  q?: string;
}): Promise<ProductRow[]> {
  await connectDB();
  const query: Record<string, unknown> = { published: true };

  // ค้นหาอิสระ — แต่ละคำต้องเจอในยี่ห้อ รุ่น หรือขนาด/สเปก
  if (filters?.q?.trim()) {
    query.$and = filters.q.trim().split(/\s+/).slice(0, 5).map((token) => {
      const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const rx = new RegExp(escaped.replace(/[/-]/g, '[/\\-R ]?'), 'i');
      return { $or: [{ brand: rx }, { model: rx }, { size: rx }] };
    });
  }
  if (filters?.brand)       query.brand   = new RegExp(`^${filters.brand}$`, 'i');
  if (filters?.category)    query.category = filters.category;
  if (filters?.productType) query.productType = filters.productType;
  
  if (filters?.size) {
    query.size = filters.size;
  }

  const docs = await Product.find(query).sort({ brand: 1, model: 1 }).lean();
  return docs.map(normalize);
}
export async function getProductById(id: string): Promise<ProductRow | null> {
  await connectDB();
  try {
    const doc = await Product.findById(id).lean();
    if (!doc) return null;
    return normalize(doc as Record<string, unknown>);
  } catch {
    return null;
  }
}

export async function getAllProductsAdmin(productType?: string): Promise<ProductRow[]> {
  await connectDB();
  // สินค้าเก่าที่ถูกสร้างก่อนมี productType field จะไม่มีค่านี้ใน DB
  // ให้นับว่าเป็น 'general' (ค่า default) เพื่อให้แสดงในแท็บสินค้าทั่วไป
  const query = !productType ? {}
    : productType === 'general'
      ? { $or: [{ productType: 'general' }, { productType: { $exists: false } }, { productType: null }] }
      : { productType };
  const docs = await Product.find(query).sort({ brand: 1, size: 1, model: 1 }).lean();
  return docs.map(normalize);
}

export async function getPopularProducts(limit = 4): Promise<ProductRow[]> {
  await connectDB();
  const match: Record<string, unknown> = { published: true };

  const badged = await Product.find({ ...match, badge: { $exists: true, $nin: ['', null] } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  if (badged.length >= limit) return badged.map(normalize);

  const rest = await Product.find({ ...match, _id: { $nin: badged.map(d => d._id) } })
    .sort({ createdAt: -1 })
    .limit(limit - badged.length)
    .lean();

  return [...badged, ...rest].map(normalize);
}
