import {
  ShieldCheck, Truck, Handshake, Cylinder, Layers3, Layers2, Link2,
  Trophy, Users, Settings, Gem, Headset, FileText,
  HardHat, Factory, Zap, Car, Cog, Landmark,
} from 'lucide-react';

export const NAV_ITEMS = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'products', href: '/products' },
  { key: 'services', href: '/services' },
  { key: 'industries', href: '/industries' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
] as const;

export const SEARCH_ENTRIES = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/about' },
  { key: 'copper', href: '/products#copper' },
  { key: 'steelPipe', href: '/products#steel-pipe' },
  { key: 'metalSupply', href: '/products#metal-supply' },
  { key: 'fittingAccessories', href: '/products#fitting-accessories' },
  { key: 'services', href: '/services' },
  { key: 'industries', href: '/industries' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
] as const;

export const HERO_FEATURES = [
  { key: 'quality', icon: ShieldCheck },
  { key: 'delivery', icon: Truck },
  { key: 'expert', icon: Handshake },
] as const;

export const PRODUCTS = [
  { id: 'copper', key: 'copper', code: 'COPPER', icon: Cylinder },
  { id: 'steel-pipe', key: 'steelPipe', code: 'STEEL PIPE', icon: Layers3 },
  { id: 'metal-supply', key: 'metalSupply', code: 'METAL SUPPLY', icon: Layers2 },
  { id: 'fitting-accessories', key: 'fittingAccessories', code: 'FITTING & ACCESSORIES', icon: Link2 },
] as const;

export const ABOUT_HIGHLIGHTS = [
  { key: 'quality', code: 'Trusted Quality', icon: Trophy },
  { key: 'experience', code: 'Years of Experience', icon: Users },
  { key: 'service', code: 'One Stop Service', icon: Settings },
  { key: 'grow', code: 'Grow Together', icon: Handshake },
] as const;

export const WHY_CHOOSE = [
  { key: 'quality', icon: Gem },
  { key: 'delivery', icon: Truck },
  { key: 'team', icon: Headset },
  { key: 'price', icon: FileText },
] as const;

export const INDUSTRIES = [
  { key: 'construction', code: 'Construction', icon: HardHat },
  { key: 'manufacturing', code: 'Manufacturing', icon: Factory },
  { key: 'energy', code: 'Energy', icon: Zap },
  { key: 'automotive', code: 'Automotive', icon: Car },
  { key: 'machinery', code: 'Machinery', icon: Cog },
  { key: 'infrastructure', code: 'Infrastructure', icon: Landmark },
] as const;

export const CONTACT_INFO = {
  address: '31 ชั้น 2 และ 3 ห้อง 208-01 ซอยสุขุมวิท 26 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110',
  phone: '02-124-3156',
  phoneHref: 'tel:021243156',
  email: 'Noppawan@Kousoku.co.th',
  lineId: '@kousoku',
  lineUrl: 'https://line.me/ti/p/~kousoku',
  // TODO: ยังไม่มีลิงก์ Facebook เพจจริง — ใส่ URL เพจจริงตรงนี้เมื่อพร้อม
  facebookUrl: '#',
};
