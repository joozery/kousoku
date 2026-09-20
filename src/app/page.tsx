import type { Metadata } from 'next';
import {
  ShieldCheck, Truck, Handshake, ArrowRight, ChevronRight,
  Cylinder, Layers3, Layers2, Link2, Trophy, Users, Settings, Gem, Headset, FileText,
  HardHat, Factory, Zap, Car, Cog, Landmark,
} from 'lucide-react';
import { SiteHeader } from '@/components/home/site-header';
import { SiteFooter } from '@/components/home/site-footer';

export const metadata: Metadata = {
  title: 'KOUSOKU (THAILAND) CO., LTD. | โลหะคุณภาพเพื่ออุตสาหกรรมที่ยั่งยืน',
  description: 'ผู้นำด้านการจัดจำหน่ายทองแดง ท่อเหล็ก และวัสดุโลหะ ตอบโจทย์ทุกความต้องการของอุตสาหกรรม',
};

const HERO_FEATURES = [
  { icon: ShieldCheck, label: 'สินค้าคุณภาพได้มาตรฐาน' },
  { icon: Truck, label: 'จัดส่งรวดเร็วทั่วประเทศ' },
  { icon: Handshake, label: 'ทีมงานผู้เชี่ยวชาญพร้อมให้คำปรึกษา' },
];

const PRODUCTS = [
  {
    icon: Cylinder,
    th: 'ทองแดง',
    en: 'COPPER',
    desc: 'ท่อทองแดง แผ่นทองแดง แท่งทองแดง และอุปกรณ์',
  },
  {
    icon: Layers3,
    th: 'ท่อเหล็ก',
    en: 'STEEL PIPE',
    desc: 'ท่อเหล็กดำ ท่อเหล็กชุบสังกะสี ท่อสแตนเลส และอุปกรณ์',
  },
  {
    icon: Layers2,
    th: 'วัสดุโลหะ',
    en: 'METAL SUPPLY',
    desc: 'เพลท เหล็กแผ่น เหล็กฉาก เหล็กตัวซี และอื่น ๆ',
  },
  {
    icon: Link2,
    th: 'อุปกรณ์ข้อต่อ',
    en: 'FITTING & ACCESSORIES',
    desc: 'ข้อต่อ สามทาง หน้าแปลน และอุปกรณ์งานระบบ',
  },
];

const ABOUT_HIGHLIGHTS = [
  { icon: Trophy, th: 'มาตรฐานสากล', en: 'Trusted Quality' },
  { icon: Users, th: 'ประสบการณ์ยาวนาน', en: 'Years of Experience' },
  { icon: Settings, th: 'บริการครบวงจร', en: 'One Stop Service' },
  { icon: Handshake, th: 'เติบโตไปด้วยกัน', en: 'Grow Together' },
];

const WHY_CHOOSE = [
  { icon: Gem, title: 'สินค้าคุณภาพ', desc: 'คัดกรองแหล่งที่มาได้มาตรฐาน' },
  { icon: Truck, title: 'จัดส่งรวดเร็ว', desc: 'รองรับทุกพื้นที่ทั่วประเทศ' },
  { icon: Headset, title: 'ทีมงานมืออาชีพ', desc: 'ให้คำปรึกษาอย่างใกล้ชิด' },
  { icon: FileText, title: 'ราคาที่แข่งขันได้', desc: 'คุ้มค่า โปร่งใส เป็นธรรม' },
];

const INDUSTRIES = [
  { icon: HardHat, th: 'ก่อสร้าง', en: 'Construction' },
  { icon: Factory, th: 'อุตสาหกรรมการผลิต', en: 'Manufacturing' },
  { icon: Zap, th: 'พลังงาน', en: 'Energy' },
  { icon: Car, th: 'ยานยนต์', en: 'Automotive' },
  { icon: Cog, th: 'เครื่องจักร', en: 'Machinery' },
  { icon: Landmark, th: 'โครงสร้างพื้นฐาน', en: 'Infrastructure' },
];

export default function HomePage() {
  return (
    <div id="top" className="bg-white text-slate-800">
      <SiteHeader />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cover/cover.png"
          alt="ท่อทองแดงและท่อเหล็กในโกดังสินค้า"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <p className="text-xs sm:text-sm font-bold tracking-[0.25em] text-amber-400 uppercase">
            Metal for a stronger tomorrow
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            โลหะคุณภาพ
            <br />
            เพื่ออุตสาหกรรม
            <br />
            <span className="text-amber-400">ที่ยั่งยืน</span>
          </h1>

          <p className="mt-6 max-w-xl text-blue-100 text-base sm:text-lg">
            ผู้นำด้านการจัดจำหน่าย ทองแดง ท่อเหล็ก และวัสดุโลหะ ตอบโจทย์ทุกความต้องการของอุตสาหกรรม
          </p>

          <ul className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-8">
            {HERO_FEATURES.map(f => (
              <li key={f.label} className="flex items-center gap-2.5 text-sm font-semibold text-blue-50">
                <span className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon size={17} className="text-amber-400" />
                </span>
                {f.label}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-full transition-colors"
            >
              ขอใบเสนอราคา <ArrowRight size={18} />
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 border border-white/40 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-full transition-colors"
            >
              ดูสินค้า
            </a>
          </div>
        </div>
      </section>

      {/* ── Products ───────────────────────────────────────── */}
      <section id="products" className="scroll-mt-16 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-blue-700 uppercase">Products</p>
              <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-blue-950">สินค้าของเรา</h2>
              <p className="mt-3 text-slate-500 max-w-lg">ครบครันด้วยสินค้าคุณภาพเพื่อตอบโจทย์ทุกอุตสาหกรรม</p>
            </div>
            <a href="#contact" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors shrink-0">
              ดูสินค้าทั้งหมด <ArrowRight size={15} />
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map(p => (
              <a
                key={p.en}
                href="#contact"
                className="group rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="h-36 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
                  <p.icon size={44} className="text-blue-100" strokeWidth={1.4} />
                </div>
                <div className="p-5">
                  <p className="font-bold text-blue-950">{p.th}</p>
                  <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">{p.en}</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{p.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:gap-2 transition-all">
                    ดูเพิ่มเติม <ChevronRight size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Us ───────────────────────────────────────── */}
      <section id="about" className="scroll-mt-16 py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          <div className="rounded-3xl h-72 lg:h-full bg-gradient-to-br from-blue-950 to-blue-800 flex flex-col items-center justify-center text-white gap-3">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-black text-lg">KSK</div>
            <p className="font-bold">KOUSOKU (THAILAND) CO., LTD.</p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-blue-700 uppercase">About us</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-blue-950">เกี่ยวกับเรา</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              บริษัท โคโซคุ (ไทยแลนด์) จำกัด ดำเนินธุรกิจค้าขายทองแดง ท่อเหล็ก และวัสดุโลหะคุณภาพ
              เพื่อตอบสนองความต้องการของภาคอุตสาหกรรมก่อสร้าง พลังงาน และงานโครงสร้างต่าง ๆ
              เรามุ่งมั่นในการส่งมอบสินค้าและบริการที่มีคุณภาพ ด้วยประสบการณ์และความเชี่ยวชาญ
              เพื่อเป็นพันธมิตรทางธุรกิจที่คุณไว้วางใจได้
            </p>
            <a href="#contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900 transition-colors">
              อ่านเพิ่มเติม <ArrowRight size={15} />
            </a>
          </div>

          <ul className="space-y-4">
            {ABOUT_HIGHLIGHTS.map(h => (
              <li key={h.en} className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <span className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <h.icon size={20} />
                </span>
                <div>
                  <p className="font-bold text-blue-950 text-sm">{h.th}</p>
                  <p className="text-xs text-slate-400">{h.en}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why Choose KSK ─────────────────────────────────── */}
      <section id="why-choose" className="scroll-mt-16 relative overflow-hidden py-20 lg:py-28 bg-gradient-to-br from-blue-950 to-blue-900 text-white">
        <Cylinder aria-hidden size={420} strokeWidth={0.6} className="pointer-events-none absolute -right-16 -bottom-16 text-white/5" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">Why choose ksk</p>
              <h2 className="mt-2 text-2xl lg:text-3xl font-bold">ทำไมต้องเลือก KSK</h2>
            </div>
            <p className="font-serif italic text-2xl text-blue-100">Your Trusted Metal Partner</p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_CHOOSE.map(c => (
              <div key={c.title} className="rounded-2xl bg-white/10 border border-white/10 p-6">
                <span className="w-11 h-11 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <c.icon size={20} />
                </span>
                <p className="mt-4 font-bold">{c.title}</p>
                <p className="mt-1 text-sm text-blue-100">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries ─────────────────────────────────────── */}
      <section id="industries" className="scroll-mt-16 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs font-bold tracking-[0.25em] text-blue-700 uppercase">Our industries</p>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-blue-950">อุตสาหกรรมที่เราให้บริการ</h2>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-5">
            {INDUSTRIES.map(ind => (
              <div
                key={ind.en}
                className="group relative rounded-2xl h-40 overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 flex flex-col items-center justify-center text-white"
              >
                <ind.icon size={32} className="text-amber-400" />
                <p className="mt-3 font-bold">{ind.th}</p>
                <p className="text-xs text-blue-200">{ind.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── News & CTA ─────────────────────────────────────── */}
      <section id="news" className="scroll-mt-16 py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-blue-700 uppercase">News & updates</p>
            <h2 className="mt-2 text-2xl font-bold text-blue-950">ข่าวสารและบทความ</h2>

            <a href="#news" className="mt-6 group block rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center">
                <Cylinder size={56} strokeWidth={1.2} className="text-blue-200" />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold text-slate-400">15 ก.ย. 2569</p>
                <p className="mt-2 font-bold text-blue-950 leading-snug">
                  แนวโน้มราคาทองแดงในตลาดโลก และผลกระทบต่ออุตสาหกรรมไทย
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 group-hover:gap-2.5 transition-all">
                  อ่านเพิ่มเติม <ArrowRight size={15} />
                </span>
              </div>
            </a>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white p-8 lg:p-10 flex flex-col justify-between min-h-[22rem]">
            <HardHat aria-hidden size={220} strokeWidth={0.8} className="pointer-events-none absolute -right-8 -top-8 text-white/10" />
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-sm self-end">KSK</div>
            <div>
              <p className="text-xl lg:text-2xl font-bold leading-snug">
                ให้เราเป็นส่วนหนึ่ง
                <br />
                ในการขับเคลื่อนอุตสาหกรรมของคุณ
              </p>
              <a
                href="#contact"
                className="mt-6 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold px-6 py-3 rounded-full transition-colors"
              >
                ขอใบเสนอราคา <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
