'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Printer, Pencil, Trash2, MoreVertical, FileText } from 'lucide-react';
import { deleteAccountingDoc } from '@/app/actions/accounting-docs';
import { KIND_LABEL, KIND_SLUG, type AccountingDocRow, type AccountingKind } from '@/lib/accounting-kinds';
import { dateSlash } from '@/lib/withholding-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const KIND_STYLE: Record<AccountingKind, string> = {
  withholding:     'border-purple-200 bg-purple-50 text-purple-700',
  payment_voucher: 'border-rose-200 bg-rose-50 text-rose-700',
  receipt_voucher: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const TABS: { value: 'all' | AccountingKind; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'withholding', label: KIND_LABEL.withholding },
  { value: 'payment_voucher', label: KIND_LABEL.payment_voucher },
  { value: 'receipt_voucher', label: KIND_LABEL.receipt_voucher },
];

export function AccountingDocsClient({ docs }: { docs: AccountingDocRow[] }) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [tab, setTab] = useState<'all' | AccountingKind>('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AccountingDocRow | null>(null);
  const [error, setError] = useState('');

  const q = search.trim().toLowerCase();
  const filtered = useMemo(() => docs.filter(d =>
    (tab === 'all' || d.kind === tab) &&
    (!q || d.docNumber.toLowerCase().includes(q) || d.partyName.toLowerCase().includes(q) || d.payee.name.toLowerCase().includes(q) || d.refDocNo.toLowerCase().includes(q)),
  ), [docs, tab, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: docs.length };
    for (const d of docs) c[d.kind] = (c[d.kind] ?? 0) + 1;
    return c;
  }, [docs]);

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    startTransition(async () => {
      const res = await deleteAccountingDoc(id);
      if (!res.ok) setError(res.error ?? 'ลบไม่สำเร็จ');
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">เอกสารบัญชี</h1>
          <p className="mt-1 text-sm text-slate-500">หนังสือรับรองหัก ณ ที่จ่าย · ใบสำคัญรับ · ใบสำคัญจ่าย</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button className="h-10 bg-green-600 px-4 text-white hover:bg-green-700" />}>
            <Plus /> สร้างเอกสาร
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {(Object.keys(KIND_LABEL) as AccountingKind[]).map(k => (
              <DropdownMenuItem key={k} render={<Link href={`/admin/accounting/new/${KIND_SLUG[k]}`} />}>
                <FileText /> {KIND_LABEL[k]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(t => (
              <button key={t.value} type="button" onClick={() => setTab(t.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${tab === t.value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                {t.label} <span className={tab === t.value ? 'text-slate-300' : 'text-slate-400'}>{counts[t.value] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input type="search" className="h-10 pl-9" placeholder="ค้นหาเลขที่ / ชื่อ..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <Table className="min-w-[760px]">
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-slate-50">
              <TableHead className="px-5">เลขที่</TableHead>
              <TableHead>ประเภท</TableHead>
              <TableHead>วันที่</TableHead>
              <TableHead>คู่กรณี</TableHead>
              <TableHead className="text-right">จำนวนเงิน</TableHead>
              <TableHead className="px-5 text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="py-12 text-center text-sm text-slate-400">
                {docs.length === 0 ? 'ยังไม่มีเอกสารบัญชี — กด "สร้างเอกสาร" เพื่อเริ่มต้น' : 'ไม่พบเอกสารที่ตรงกับเงื่อนไข'}
              </TableCell></TableRow>
            )}
            {filtered.map(d => {
              const isWht = d.kind === 'withholding';
              return (
                <TableRow key={d.id}>
                  <TableCell className="px-5 py-3 font-mono text-xs">
                    <Link href={`/admin/accounting/${d.id}/print`} className="text-slate-700 hover:text-green-700 hover:underline">{d.docNumber}</Link>
                  </TableCell>
                  <TableCell><Badge variant="outline" className={KIND_STYLE[d.kind]}>{KIND_LABEL[d.kind]}</Badge></TableCell>
                  <TableCell className="text-sm text-slate-600">{dateSlash(d.issuedAt)}</TableCell>
                  <TableCell className="max-w-64 truncate text-sm text-slate-800">{isWht ? d.payee.name : d.partyName}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {isWht ? (
                      <span className="text-sm"><span className="text-xs text-slate-400">ภาษีหัก </span><span className="font-bold text-slate-900">฿{money(d.totalTax)}</span>
                        <span className="block text-[11px] text-slate-400">จ่าย ฿{money(d.totalPaid)}</span></span>
                    ) : <span className="text-sm font-bold text-slate-900">฿{money(d.total)}</span>}
                  </TableCell>
                  <TableCell className="px-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`จัดการ ${d.docNumber}`} />}><MoreVertical /></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem render={<Link href={`/admin/accounting/${d.id}/print`} />}><Printer /> พิมพ์ / ดูตัวอย่าง</DropdownMenuItem>
                        <DropdownMenuItem render={<Link href={`/admin/accounting/${d.id}/edit`} />}><Pencil /> แก้ไข</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => setDeleteTarget(d)}><Trash2 /> ลบ</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบเอกสารนี้?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `${KIND_LABEL[deleteTarget.kind]} เลขที่ ${deleteTarget.docNumber} จะถูกลบถาวร และเลขที่นี้อาจถูกนำไปใช้ซ้ำเมื่อเป็นเลขล่าสุดของเดือน`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>ลบเอกสาร</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
