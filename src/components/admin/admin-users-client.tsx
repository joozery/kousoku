'use client';

import { useActionState, useTransition, useState, useEffect } from 'react';
import { createAdminUser, deleteAdminUser, toggleAdminUserActive, updateAdminUser, changeAdminPassword } from '@/app/actions/admin-users';
import {
  Trash2, UserPlus, Shield, ShieldCheck, Search, Pencil, Lock, Power, PowerOff, Check, Clock, Users, UserCheck, MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminUserRow {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  role: 'super' | 'admin';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface Props {
  users: AdminUserRow[];
  currentUsername: string;
}

type FormState = { error?: string; success?: boolean } | null;

const ROLE_ITEMS = [
  { value: 'admin', label: 'Admin' },
  { value: 'super', label: 'Super Admin' },
];
const ROLE_FILTER_ITEMS = [{ value: 'all', label: 'ทุกบทบาท' }, ...ROLE_ITEMS];
const STATUS_FILTER_ITEMS = [
  { value: 'all', label: 'ทุกสถานะ' },
  { value: 'active', label: 'ใช้งาน' },
  { value: 'inactive', label: 'ปิดใช้งาน' },
];

const primaryBtn = 'h-10 px-4 bg-green-600 text-white hover:bg-green-700';
const fieldCls = 'h-10';

// ─── Shared bits ───────────────────────────────────────────────
function FormAlert({ state, successText }: { state: FormState; successText: string }) {
  if (state?.error) {
    return <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">{state.error}</div>;
  }
  if (state?.success) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-600">
        <Check size={14} /> {successText}
      </div>
    );
  }
  return null;
}

// ปิดหน้าต่างอัตโนมัติหลังบันทึกสำเร็จ (เว้นเวลาให้เห็นข้อความสำเร็จ)
function useCloseOnSuccess(state: FormState, onClose: () => void, delay = 900) {
  useEffect(() => {
    if (!state?.success) return;
    const t = setTimeout(onClose, delay);
    return () => clearTimeout(t);
  }, [state?.success, onClose, delay]);
}

function RoleSelect({ name, defaultValue }: { name: string; defaultValue: 'admin' | 'super' }) {
  return (
    <Select name={name} defaultValue={defaultValue} items={ROLE_ITEMS}>
      <SelectTrigger className="w-full data-[size=default]:h-10">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLE_ITEMS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function RoleBadge({ role }: { role: AdminUserRow['role'] }) {
  return role === 'super' ? (
    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700"><ShieldCheck /> Super Admin</Badge>
  ) : (
    <Badge variant="secondary"><Shield /> Admin</Badge>
  );
}

// ─── Dialogs ───────────────────────────────────────────────────
function CreateDialog({ onClose }: { onClose: () => void }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createAdminUser, null);
  useCloseOnSuccess(state, onClose, 1200);

  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><UserPlus size={16} className="text-green-600" /> เพิ่มบัญชีใหม่</DialogTitle>
          <DialogDescription>สร้างบัญชีผู้ดูแลระบบสำหรับเข้าสู่หลังบ้าน</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <FormAlert state={state} successText="เพิ่มบัญชีสำเร็จแล้ว กำลังปิดหน้าต่าง..." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="new-username">Username *</Label>
              <Input id="new-username" name="username" required placeholder="เช่น staff01" className={fieldCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-displayName">ชื่อที่แสดง *</Label>
              <Input id="new-displayName" name="displayName" required placeholder="เช่น คุณสมชาย" className={fieldCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-email">อีเมล</Label>
              <Input id="new-email" type="email" name="email" placeholder="example@email.com" className={fieldCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-phone">เบอร์โทร</Label>
              <Input id="new-phone" type="tel" name="phone" placeholder="08x-xxx-xxxx" className={fieldCls} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new-password">รหัสผ่าน * (อย่างน้อย 6 ตัว)</Label>
              <Input id="new-password" type="password" name="password" required placeholder="••••••••" className={fieldCls} />
            </div>
            <div className="space-y-1.5">
              <Label>บทบาท</Label>
              <RoleSelect name="role" defaultValue="admin" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="h-10" onClick={onClose}>ยกเลิก</Button>
            <Button type="submit" disabled={pending} className={primaryBtn}>
              <UserPlus /> {pending ? 'กำลังเพิ่ม...' : 'เพิ่มบัญชี'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditDialog({ user, onClose }: { user: AdminUserRow; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateAdminUser, null);
  useCloseOnSuccess(state, onClose);

  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pencil size={16} className="text-green-600" /> แก้ไขข้อมูลผู้ใช้</DialogTitle>
          <DialogDescription>บัญชี <span className="font-mono">{user.username}</span></DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />
          <FormAlert state={state} successText="บันทึกสำเร็จ" />
          <div className="space-y-1.5">
            <Label htmlFor="edit-displayName">ชื่อที่แสดง *</Label>
            <Input id="edit-displayName" name="displayName" defaultValue={user.displayName} required className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-email">อีเมล</Label>
            <Input id="edit-email" type="email" name="email" defaultValue={user.email} className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">เบอร์โทร</Label>
            <Input id="edit-phone" type="tel" name="phone" defaultValue={user.phone} className={fieldCls} />
          </div>
          <div className="space-y-1.5">
            <Label>บทบาท</Label>
            <RoleSelect name="role" defaultValue={user.role} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="h-10" onClick={onClose}>ยกเลิก</Button>
            <Button type="submit" disabled={pending} className={primaryBtn}>{pending ? 'กำลังบันทึก...' : 'บันทึก'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordDialog({ user, onClose }: { user: AdminUserRow; onClose: () => void }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(changeAdminPassword, null);
  useCloseOnSuccess(state, onClose);

  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Lock size={16} className="text-amber-500" /> เปลี่ยนรหัสผ่าน</DialogTitle>
          <DialogDescription>ตั้งรหัสผ่านใหม่ให้ <span className="font-semibold text-foreground">{user.displayName}</span></DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="id" value={user.id} />
          <FormAlert state={state} successText="เปลี่ยนรหัสผ่านสำเร็จ" />
          <div className="space-y-1.5">
            <Label htmlFor="pw-new">รหัสผ่านใหม่ *</Label>
            <Input id="pw-new" type="password" name="newPassword" required placeholder="อย่างน้อย 6 ตัวอักษร" className={fieldCls} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" className="h-10" onClick={onClose}>ยกเลิก</Button>
            <Button type="submit" disabled={pending} className="h-10 px-4 bg-amber-500 text-white hover:bg-amber-600">
              {pending ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Row actions ───────────────────────────────────────────────
function RowActions({
  user, isSelf, onEdit, onPassword, onToggle, onDelete,
}: {
  user: AdminUserRow;
  isSelf: boolean;
  onEdit: () => void;
  onPassword: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`จัดการ ${user.displayName}`} />}>
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onEdit}><Pencil /> แก้ไขข้อมูล</DropdownMenuItem>
        <DropdownMenuItem onClick={onPassword}><Lock /> เปลี่ยนรหัสผ่าน</DropdownMenuItem>
        {!isSelf && (
          <>
            <DropdownMenuItem onClick={onToggle}>
              {user.isActive ? <PowerOff /> : <Power />}
              {user.isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={onDelete}><Trash2 /> ลบบัญชี</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main ──────────────────────────────────────────────────────
export function AdminUsersClient({ users, currentUsername }: Props) {
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'super' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<AdminUserRow | null>(null);
  const [passwordUser, setPasswordUser] = useState<AdminUserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);

  const q = search.trim().toLowerCase();
  const filtered = users.filter(u => {
    const matchesSearch =
      !q ||
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? u.isActive : !u.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    { label: 'ทั้งหมด', value: users.length, icon: Users, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
    { label: 'Super Admin', value: users.filter(u => u.role === 'super').length, icon: ShieldCheck, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
    { label: 'Admin', value: users.filter(u => u.role === 'admin').length, icon: Shield, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'ใช้งานอยู่', value: users.filter(u => u.isActive).length, icon: UserCheck, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
  ];

  function confirmDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    startTransition(() => deleteAdminUser(id, currentUsername));
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'ยังไม่เคย Login';
    return new Date(dateStr).toLocaleString('th-TH', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <>
      {showCreate && <CreateDialog onClose={() => setShowCreate(false)} />}
      {editUser && <EditDialog user={editUser} onClose={() => setEditUser(null)} />}
      {passwordUser && <PasswordDialog user={passwordUser} onClose={() => setPasswordUser(null)} />}

      <AlertDialog open={!!deleteTarget} onOpenChange={o => { if (!o) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ลบบัญชีนี้?</AlertDialogTitle>
            <AlertDialogDescription>
              บัญชี &ldquo;{deleteTarget?.displayName}&rdquo; ({deleteTarget?.username}) จะถูกลบถาวร และเข้าสู่ระบบไม่ได้อีก
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmDelete}>ลบบัญชี</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(s => (
            <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                <s.icon size={18} />
              </div>
              <div>
                <p className="text-2xl font-black leading-tight text-slate-800">{s.value}</p>
                <p className="text-xs font-medium text-slate-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center">
            <h2 className="font-bold text-slate-800">บัญชีผู้ดูแลระบบ ({filtered.length})</h2>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  type="search"
                  placeholder="ค้นหาชื่อ, username, email..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-10 pl-9"
                />
              </div>
              <Select items={ROLE_FILTER_ITEMS} value={roleFilter} onValueChange={v => setRoleFilter((v ?? 'all') as typeof roleFilter)}>
                <SelectTrigger className="w-36 data-[size=default]:h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ROLE_FILTER_ITEMS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select items={STATUS_FILTER_ITEMS} value={statusFilter} onValueChange={v => setStatusFilter((v ?? 'all') as typeof statusFilter)}>
                <SelectTrigger className="w-36 data-[size=default]:h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_FILTER_ITEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button className={primaryBtn} onClick={() => setShowCreate(true)}>
                <UserPlus /> เพิ่มบัญชี
              </Button>
            </div>
          </div>

          <Table className="min-w-[720px]">
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-slate-50">
                <TableHead className="px-5">ผู้ใช้</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>Login ล่าสุด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="px-5 text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-400">ไม่พบผู้ใช้งาน</TableCell>
                </TableRow>
              )}
              {filtered.map(user => {
                const isSelf = user.username === currentUsername;
                return (
                  <TableRow key={user.id}>
                    <TableCell className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="lg">
                          <AvatarFallback className={user.isActive ? 'bg-gradient-to-br from-green-400 to-green-600 font-bold text-white' : 'bg-slate-300 font-bold text-white'}>
                            {user.displayName[0]?.toUpperCase()}
                          </AvatarFallback>
                          <AvatarBadge className={user.isActive ? 'bg-green-500' : 'bg-slate-300'} />
                        </Avatar>
                        <div className={user.isActive ? '' : 'opacity-60'}>
                          <p className="flex items-center gap-1.5 font-semibold text-slate-800">
                            {user.displayName}
                            {isSelf && <Badge className="h-4 bg-green-100 px-1.5 text-[10px] text-green-700">คุณ</Badge>}
                          </p>
                          <p className="text-xs text-slate-400">{user.email || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-500">{user.username}</TableCell>
                    <TableCell><RoleBadge role={user.role} /></TableCell>
                    <TableCell className="text-xs text-slate-400">
                      <span className="flex items-center gap-1.5"><Clock size={12} />{formatDate(user.lastLoginAt)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.isActive ? 'border-green-200 bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}>
                        {user.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 text-right">
                      <RowActions
                        user={user}
                        isSelf={isSelf}
                        onEdit={() => setEditUser(user)}
                        onPassword={() => setPasswordUser(user)}
                        onToggle={() => startTransition(() => toggleAdminUserActive(user.id, currentUsername))}
                        onDelete={() => setDeleteTarget(user)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
