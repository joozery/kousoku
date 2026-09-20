'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { createAccountingDoc, updateAccountingDoc } from '@/app/actions/accounting-docs';
import { KIND_LABEL, type AccountingDocInput, type AccountingKind, type IncomeLine, type Party } from '@/lib/accounting-kinds';
import { WHT_ROWS, FORM_TYPES, PAYER_CONDITIONS } from '@/lib/withholding-form';
import { numberToThaiBahtText } from '@/lib/thai-baht-text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const money = (n: number) => n.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : 0; };
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

const field = 'h-10';
const selectTrigger = 'w-full data-[size=default]:h-10';

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5">
      <h2 className="font-bold text-slate-900">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── ใบสำคัญรับ / จ่าย ────────────────────────────────────────
type VoucherState = {
  issuedAt: string; partyName: string; refDocNo: string; items: { description: string; amount: string }[];
  payMethod: 'cash' | 'transfer' | 'cheque'; payRefNo: string; branch: string; bankName: string; accountName: string;
  approvedBy: string; note: string;
};

function VoucherFields({ kind, s, set }: { kind: AccountingKind; s: VoucherState; set: (p: Partial<VoucherState>) => void }) {
  const isPay = kind === 'payment_voucher';
  const total = round2(s.items.reduce((t, i) => t + num(i.amount), 0));
  const payItems = [{ value: 'cash', label: 'เงินสด' }, { value: 'transfer', label: 'โอนเงิน' }, { value: 'cheque', label: 'เช็ค' }];

  return (
    <>
      <Card title="ข้อมูลเอกสาร">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="วันที่ *"><DatePicker value={s.issuedAt} onChange={e => set({ issuedAt: e.target.value })} className="h-10 w-full rounded-lg border border-input px-3 text-sm" /></Field>
          <Field label={isPay ? 'จ่ายให้ (Pay to) *' : 'รับจาก (Received from) *'} className="sm:col-span-2">
            <Input className={field} value={s.partyName} onChange={e => set({ partyName: e.target.value })} placeholder={isPay ? 'ชื่อผู้รับเงิน / ร้านค้า / บริษัท' : 'ชื่อผู้จ่ายเงิน / ลูกค้า'} />
          </Field>
          <Field label="ใบกำกับเลขที่ / อ้างอิง" className="sm:col-span-3">
            <Input className={field} value={s.refDocNo} onChange={e => set({ refDocNo: e.target.value })} placeholder="เลขที่ใบกำกับภาษี / ใบเสร็จ (ถ้ามี)" />
          </Field>
        </div>
      </Card>

      <Card title="รายการ" hint="ระบุคำอธิบายและจำนวนเงินของแต่ละรายการ">
        <div className="space-y-2">
          {s.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input className={`${field} flex-1`} value={it.description} placeholder={`รายการที่ ${i + 1}`}
                onChange={e => set({ items: s.items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} />
              <Input className={`${field} w-36 text-right`} type="number" min="0" step="0.01" value={it.amount} placeholder="0.00"
                onChange={e => set({ items: s.items.map((x, j) => (j === i ? { ...x, amount: e.target.value } : x)) })} />
              <Button type="button" variant="ghost" size="icon" aria-label="ลบรายการ" disabled={s.items.length === 1}
                onClick={() => set({ items: s.items.filter((_, j) => j !== i) })}><Trash2 /></Button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <Button type="button" variant="outline" className="h-9" onClick={() => set({ items: [...s.items, { description: '', amount: '' }] })}><Plus /> เพิ่มรายการ</Button>
          <div className="text-right">
            <p className="text-xs text-slate-400">รวมเงิน</p>
            <p className="text-xl font-black text-slate-900">฿{money(total)}</p>
            {total > 0 && <p className="text-xs text-slate-500">({numberToThaiBahtText(total)})</p>}
          </div>
        </div>
      </Card>

      <Card title={isPay ? 'การจ่ายเงิน' : 'การรับเงิน'}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={isPay ? 'จ่ายโดย' : 'รับโดย'}>
            <Select items={payItems} value={s.payMethod} onValueChange={v => set({ payMethod: (v ?? 'cash') as VoucherState['payMethod'] })}>
              <SelectTrigger className={selectTrigger}><SelectValue /></SelectTrigger>
              <SelectContent>{payItems.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="เลขที่ (เลขที่บัญชี / เช็ค / รายการโอน)"><Input className={field} value={s.payRefNo} onChange={e => set({ payRefNo: e.target.value })} /></Field>
          <Field label="ธนาคาร"><Input className={field} value={s.bankName} onChange={e => set({ bankName: e.target.value })} placeholder="เช่น ธ.กสิกร" /></Field>
          <Field label="สาขา"><Input className={field} value={s.branch} onChange={e => set({ branch: e.target.value })} /></Field>
          <Field label="ชื่อบัญชี" className="sm:col-span-2"><Input className={field} value={s.accountName} onChange={e => set({ accountName: e.target.value })} /></Field>
          <Field label="ผู้อนุมัติ (Approved)"><Input className={field} value={s.approvedBy} onChange={e => set({ approvedBy: e.target.value })} /></Field>
          <Field label="หมายเหตุ"><Input className={field} value={s.note} onChange={e => set({ note: e.target.value })} /></Field>
        </div>
      </Card>
    </>
  );
}

// ─── 50 ทวิ ────────────────────────────────────────────────────
type LineState = { paidDate: string; paidAmount: string; rate: string; tax: string; note: string };
type WhtState = {
  issuedAt: string; formType: string; formSeq: string; payer: Party; payee: Party;
  lines: Record<string, LineState>;
  fundGpf: string; fundSso: string; fundProvident: string;
  payerCondition: 'withhold' | 'forever' | 'once' | 'other'; payerConditionOther: string; note: string;
};

function PartyFields({ p, set, prefix }: { p: Party; set: (v: Party) => void; prefix: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="ชื่อ *" className="sm:col-span-2"><Input id={`${prefix}-name`} className={field} value={p.name} onChange={e => set({ ...p, name: e.target.value })} placeholder="บุคคล / นิติบุคคล / บริษัท" /></Field>
      <Field label="เลขประจำตัวผู้เสียภาษี (13 หลัก)"><Input className={field} inputMode="numeric" maxLength={17} value={p.taxId} onChange={e => set({ ...p, taxId: e.target.value })} placeholder="0-0000-00000-00-0" /></Field>
      <Field label="สาขา"><Input className={field} value={p.branch} onChange={e => set({ ...p, branch: e.target.value })} placeholder="สำนักงานใหญ่" /></Field>
      <Field label="ที่อยู่" className="sm:col-span-2"><Input className={field} value={p.address} onChange={e => set({ ...p, address: e.target.value })} /></Field>
    </div>
  );
}

function WithholdingFields({ s, set }: { s: WhtState; set: (p: Partial<WhtState>) => void }) {
  const typeItems = [{ value: 'none', label: '— ไม่ระบุ —' }, ...FORM_TYPES.map(f => ({ value: f.value, label: `(${f.no}) ${f.label}` }))];

  const setLine = (key: string, patch: Partial<LineState>) => {
    const cur = s.lines[key];
    const next = { ...cur, ...patch };
    // แก้จำนวนเงิน/อัตรา → คำนวณภาษีให้อัตโนมัติ (แก้ช่องภาษีเองได้)
    if ('paidAmount' in patch || 'rate' in patch) {
      const r = num(next.rate);
      if (r > 0) next.tax = String(round2((num(next.paidAmount) * r) / 100));
    }
    set({ lines: { ...s.lines, [key]: next } });
  };

  const totalPaid = round2(Object.values(s.lines).reduce((t, l) => t + num(l.paidAmount), 0));
  const totalTax = round2(Object.values(s.lines).reduce((t, l) => t + num(l.tax), 0));
  const rows = WHT_ROWS;

  return (
    <>
      <Card title="ข้อมูลเอกสาร" hint="เลขที่และเล่มที่ออกให้อัตโนมัติเมื่อบันทึก">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="วันที่ออกหนังสือรับรอง *"><DatePicker value={s.issuedAt} onChange={e => set({ issuedAt: e.target.value })} className="h-10 w-full rounded-lg border border-input px-3 text-sm" /></Field>
          <Field label="ยื่นในแบบ">
            <Select items={typeItems} value={s.formType || 'none'} onValueChange={v => set({ formType: !v || v === 'none' ? '' : v })}>
              <SelectTrigger className={selectTrigger}><SelectValue /></SelectTrigger>
              <SelectContent>{typeItems.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="ลำดับที่ในแบบ"><Input className={field} value={s.formSeq} onChange={e => set({ formSeq: e.target.value })} /></Field>
        </div>
      </Card>

      <Card title="ผู้มีหน้าที่หักภาษี ณ ที่จ่าย" hint="ค่าเริ่มต้นดึงจากตั้งค่าหัวกระดาษเอกสาร (บริษัทของเรา)"><PartyFields p={s.payer} set={payer => set({ payer })} prefix="payer" /></Card>
      <Card title="ผู้ถูกหักภาษี ณ ที่จ่าย" hint="ผู้ที่เราจ่ายเงินให้ (เช่น ผู้รับจ้าง ผู้ให้บริการ)"><PartyFields p={s.payee} set={payee => set({ payee })} prefix="payee" /></Card>

      <Card title="ประเภทเงินได้พึงประเมินที่จ่าย" hint="กรอกจำนวนเงิน + อัตราภาษี (%) ระบบคำนวณภาษีที่หักให้ (แก้ตัวเลขเองได้)">
        <div className="hidden grid-cols-[1fr_9rem_8rem_5rem_8rem] gap-2 px-1 pb-1 text-xs font-semibold text-slate-400 md:grid">
          <span>ประเภทเงินได้</span><span>วันที่จ่าย</span><span className="text-right">จำนวนเงินที่จ่าย</span><span className="text-right">อัตรา %</span><span className="text-right">ภาษีที่หัก</span>
        </div>
        <div className="space-y-3 md:space-y-2">
          {rows.map(r => {
            const l = s.lines[r.key];
            return (
              <div key={r.key} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 p-3 md:grid-cols-[1fr_9rem_8rem_5rem_8rem] md:items-center md:border-0 md:p-0">
                <p className="col-span-2 text-sm leading-snug text-slate-700 md:col-span-1">
                  {r.short}
                  {r.withNote && (
                    <Input className="mt-1 h-8" value={l.note} onChange={e => setLine(r.key, { note: e.target.value })} placeholder="ระบุ..." />
                  )}
                </p>
                <DatePicker value={l.paidDate} onChange={e => setLine(r.key, { paidDate: e.target.value })} className="h-10 w-full rounded-lg border border-input px-2 text-sm" />
                <Input className={`${field} text-right`} type="number" min="0" step="0.01" placeholder="0.00" value={l.paidAmount} onChange={e => setLine(r.key, { paidAmount: e.target.value })} />
                <Input className={`${field} text-right`} type="number" min="0" step="0.5" placeholder="%" value={l.rate} onChange={e => setLine(r.key, { rate: e.target.value })} list="wht-rates" />
                <Input className={`${field} text-right`} type="number" min="0" step="0.01" placeholder="0.00" value={l.tax} onChange={e => setLine(r.key, { tax: e.target.value })} />
              </div>
            );
          })}
        </div>
        <datalist id="wht-rates">{[1, 2, 3, 5, 10, 15].map(r => <option key={r} value={r} />)}</datalist>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
          <div>
            <p className="text-xs text-slate-400">รวมเงินที่จ่าย</p>
            <p className="font-bold text-slate-900">฿{money(totalPaid)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">รวมภาษีที่หักนำส่ง</p>
            <p className="text-xl font-black text-emerald-700">฿{money(totalTax)}</p>
            {totalTax > 0 && <p className="text-xs text-slate-500">({numberToThaiBahtText(totalTax)})</p>}
          </div>
        </div>
      </Card>

      <Card title="เงินที่จ่ายเข้ากองทุน (ถ้ามี)" hint="ไม่ต้องกรอกถ้าไม่มี — จะแสดงเป็นเส้นประในเอกสาร">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="กบข./กสจ./กองทุนสงเคราะห์ครูโรงเรียนเอกชน (บาท)"><Input className={`${field} text-right`} type="number" min="0" step="0.01" value={s.fundGpf} onChange={e => set({ fundGpf: e.target.value })} /></Field>
          <Field label="กองทุนประกันสังคม (บาท)"><Input className={`${field} text-right`} type="number" min="0" step="0.01" value={s.fundSso} onChange={e => set({ fundSso: e.target.value })} /></Field>
          <Field label="กองทุนสำรองเลี้ยงชีพ (บาท)"><Input className={`${field} text-right`} type="number" min="0" step="0.01" value={s.fundProvident} onChange={e => set({ fundProvident: e.target.value })} /></Field>
        </div>
      </Card>

      <Card title="ผู้จ่ายเงิน">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {PAYER_CONDITIONS.map(c => (
            <label key={c.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="radio" name="payerCondition" checked={s.payerCondition === c.value} onChange={() => set({ payerCondition: c.value })} className="h-4 w-4 accent-green-600" />
              {c.label}
            </label>
          ))}
        </div>
        {s.payerCondition === 'other' && <Input className={`${field} mt-3 max-w-md`} value={s.payerConditionOther} onChange={e => set({ payerConditionOther: e.target.value })} placeholder="ระบุ" />}
        <Field label="หมายเหตุ (ภายใน ไม่พิมพ์ลงเอกสาร)" className="mt-4"><Input className={field} value={s.note} onChange={e => set({ note: e.target.value })} /></Field>
      </Card>
    </>
  );
}

// ─── ตัวห่อหลัก ────────────────────────────────────────────────
function toVoucherState(i: AccountingDocInput): VoucherState {
  return {
    issuedAt: i.issuedAt, partyName: i.partyName, refDocNo: i.refDocNo,
    items: i.items.length ? i.items.map(x => ({ description: x.description, amount: x.amount ? String(x.amount) : '' })) : [{ description: '', amount: '' }],
    payMethod: i.payMethod, payRefNo: i.payRefNo, branch: i.branch, bankName: i.bankName, accountName: i.accountName, approvedBy: i.approvedBy, note: i.note,
  };
}

function toWhtState(i: AccountingDocInput): WhtState {
  const lines: Record<string, LineState> = {};
  for (const r of WHT_ROWS) lines[r.key] = { paidDate: '', paidAmount: '', rate: '', tax: '', note: '' };
  for (const l of i.incomeLines) {
    lines[l.key] = {
      paidDate: l.paidDate, paidAmount: l.paidAmount ? String(l.paidAmount) : '',
      rate: l.paidAmount > 0 && l.tax > 0 ? String(round2((l.tax / l.paidAmount) * 100)) : '',
      tax: l.tax ? String(l.tax) : '', note: l.note,
    };
  }
  return {
    issuedAt: i.issuedAt, formType: i.formType, formSeq: i.formSeq, payer: i.payer, payee: i.payee, lines,
    fundGpf: i.fundGpf ? String(i.fundGpf) : '', fundSso: i.fundSso ? String(i.fundSso) : '',
    fundProvident: i.fundProvident ? String(i.fundProvident) : '',
    payerCondition: i.payerCondition, payerConditionOther: i.payerConditionOther, note: i.note,
  };
}

export function AccountingDocForm({ kind, initial, docId, docNumber }: {
  kind: AccountingKind; initial: AccountingDocInput; docId?: string; docNumber?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [v, setV] = useState<VoucherState>(() => toVoucherState(initial));
  const [w, setW] = useState<WhtState>(() => toWhtState(initial));
  const isWht = kind === 'withholding';

  function submit() {
    setError('');
    const base: AccountingDocInput = { ...initial, kind };
    let input: AccountingDocInput;
    if (isWht) {
      const lines: IncomeLine[] = Object.entries(w.lines)
        .map(([key, l]) => ({ key, paidDate: l.paidDate, paidAmount: num(l.paidAmount), tax: num(l.tax), note: l.note }))
        .filter(l => l.paidAmount > 0 || l.tax > 0);
      input = {
        ...base, issuedAt: w.issuedAt, formType: w.formType as AccountingDocInput['formType'], formSeq: w.formSeq,
        payer: w.payer, payee: w.payee, incomeLines: lines,
        fundGpf: num(w.fundGpf), fundSso: num(w.fundSso), fundProvident: num(w.fundProvident),
        payerCondition: w.payerCondition, payerConditionOther: w.payerConditionOther, note: w.note,
      };
    } else {
      input = {
        ...base, issuedAt: v.issuedAt, partyName: v.partyName, refDocNo: v.refDocNo,
        items: v.items.map(i => ({ description: i.description, amount: num(i.amount) })),
        payMethod: v.payMethod, payRefNo: v.payRefNo, branch: v.branch, bankName: v.bankName, accountName: v.accountName,
        approvedBy: v.approvedBy, note: v.note,
      };
    }
    startTransition(async () => {
      const res = docId ? await updateAccountingDoc(docId, input) : await createAccountingDoc(input);
      if (res.ok) router.push(`/admin/accounting/${res.id}/print`);
      else setError(res.error);
    });
  }

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/accounting" className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="กลับ"><ArrowLeft size={16} /></Link>
          <div>
            <h1 className="text-xl font-black text-slate-900">{docId ? 'แก้ไข' : 'สร้าง'}{KIND_LABEL[kind]}</h1>
            <p className="mt-0.5 text-xs text-slate-400">{docNumber ? `เลขที่ ${docNumber}` : 'ออกเลขที่อัตโนมัติเมื่อบันทึก'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {error && <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600"><AlertCircle size={13} /> {error}</span>}
          <Button type="button" className="h-10 bg-green-600 px-5 text-white hover:bg-green-700" disabled={pending} onClick={submit}>
            <Save /> {pending ? 'กำลังบันทึก...' : docId ? 'บันทึกการแก้ไข' : 'บันทึกและดูตัวอย่าง'}
          </Button>
        </div>
      </div>

      {isWht
        ? <WithholdingFields s={w} set={p => setW(prev => ({ ...prev, ...p }))} />
        : <VoucherFields kind={kind} s={v} set={p => setV(prev => ({ ...prev, ...p }))} />}
    </div>
  );
}
