import { Schema, model, models } from 'mongoose';

export type ProductType = string;

export interface IProduct {
  productType: string;
  brand: string;
  model: string;
  size: string;
  type: string;
  note: string;
  description: string; // รายละเอียดสินค้า — แสดงบนหน้ารายละเอียด
  warranty: string;    // เงื่อนไขประกัน เช่น "รับประกัน 2 ปี หรือ 50,000 กม."
  priceCash: number;
  priceCredit: number;
  priceInstallment: number;
  costPrice: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  images: string[]; // รูปเพิ่มเติม (แกลเลอรี) — image คือรูปหลัก
  category: string;
  stock: number;
  year: string;
  published: boolean;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  productType:      { type: String, default: 'general' },
  brand:            { type: String, required: true },
  model:            { type: String, required: true },
  size:             { type: String, default: '' },
  type:             { type: String, default: '' },
  note:             { type: String, default: '' },
  description:      { type: String, default: '' },
  warranty:         { type: String, default: '' },
  priceCash:        { type: Number, required: true },
  priceCredit:      { type: Number, required: true },
  priceInstallment: { type: Number, required: true },
  costPrice:        { type: Number, default: 0 },
  oldPrice:         { type: Number },
  badge:            { type: String },
  image:            { type: String, default: '/yang.png' },
  images:           { type: [String], default: [] },
  category:         { type: String, default: 'general' },
  stock:     { type: Number, required: true, default: 0 },
  year:      { type: String, default: '26' },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const Product = models.Product ?? model<IProduct>('Product', ProductSchema);
