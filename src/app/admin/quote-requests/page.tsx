import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { COOKIE_NAME, verifySessionToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import QuoteRequest from '@/models/QuoteRequest';

export default async function QuoteRequestsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token || !await verifySessionToken(token)) redirect('/admin/login');
  const params = await searchParams;
  const requestedPage = Math.max(1, Math.min(10000, Number.parseInt(params.page || '1', 10) || 1));
  await connectDB();
  const total = await QuoteRequest.countDocuments();
  const pages = Math.max(1, Math.ceil(total / 20));
  const page = Math.min(requestedPage, pages);
  const requests = await QuoteRequest.find().sort({ createdAt: -1 }).skip((page - 1) * 20).limit(20).lean();
  return <div className="mx-auto max-w-5xl p-6"><h1 className="text-2xl font-bold">คำขอใบเสนอราคาจากเว็บไซต์</h1><p className="mt-2 text-sm text-slate-500">ทั้งหมด {total} คำขอ</p><div className="mt-6 space-y-4">{requests.map(item => <article key={item.requestId} className="rounded-xl border bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">{item.name}{item.company && ` · ${item.company}`}</h2><p className="mt-1 text-sm text-slate-500">{new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok' }).format(item.createdAt)}</p></div><div className="flex flex-wrap gap-3 text-sm text-blue-700"><a href={`mailto:${item.email}`}>{item.email}</a><a href={`tel:${item.phone.replace(/[^+\d]/g, '')}`}>{item.phone}</a></div></div><dl className="mt-4 grid gap-3 text-sm"><div><dt className="font-semibold">สินค้า / สเปค</dt><dd className="mt-1 whitespace-pre-wrap break-words">{item.products}</dd></div><div><dt className="font-semibold">จำนวน / หน่วย</dt><dd>{item.quantity}</dd></div>{item.details && <div><dt className="font-semibold">รายละเอียดเพิ่มเติม</dt><dd className="mt-1 whitespace-pre-wrap break-words">{item.details}</dd></div>}</dl><p className="mt-4 break-all text-xs text-slate-400">เลขอ้างอิง: {item.requestId}</p></article>)}{!requests.length && <p className="rounded-xl border bg-white p-8 text-center text-slate-500">ยังไม่มีคำขอใบเสนอราคา</p>}</div><nav aria-label="หน้ารายการคำขอ" className="mt-6 flex justify-center gap-5 text-sm">{page > 1 && <Link href={`/admin/quote-requests?page=${page - 1}`}>ก่อนหน้า</Link>}<span>{page} / {pages}</span>{page < pages && <Link href={`/admin/quote-requests?page=${page + 1}`}>ถัดไป</Link>}</nav></div>;
}
