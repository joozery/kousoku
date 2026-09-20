"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  Home, Users, Package,
  ShoppingBag, Warehouse, FileText, DollarSign,
  UserCircle, UserCircle2, CalendarDays, BarChart2, Settings,
  HeadphonesIcon, ChevronDown, ShieldCheck,
  CalendarClock, CalendarOff,
  CalendarRange, Landmark, ClipboardList,
  Receipt, FileEdit, FileClock, FileMinus, BookMarked, List, Files, FileSpreadsheet,
} from 'lucide-react';
import { newDocHref } from '@/lib/doc-routes';

interface SidebarProps {
  isOpen: boolean;
}

type NavNode = {
  key: string;
  icon: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  children?: NavNode[];
};

function hasActiveDescendant(node: NavNode): boolean {
  if (node.active) return true;
  return node.children?.some(hasActiveDescendant) ?? false;
}

function getFirstHref(node: NavNode): string {
  if (node.href) return node.href;
  if (node.children?.length) return getFirstHref(node.children[0]);
  return '#';
}

export function AdminSidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  // เก็บกลุ่มที่ผู้ใช้กด toggle เอง
  const [toggled, setToggled] = useState<Set<string>>(new Set());

  const menuGroups: { title: string; items: NavNode[] }[] = [
    {
      title: "เมนูหลัก",
      items: [
        {
          key: 'home',
          icon: <Home size={18} />,
          label: "หน้าหลัก",
          href: "/admin",
          active: pathname === "/admin"
        },
        {
          key: 'finance-root',
          icon: <DollarSign size={18} />,
          label: "การเงิน",
          children: [
            {
              key: 'accounting',
              icon: <Landmark size={17} />,
              label: "ฝ่ายบัญชี",
              children: [
                {
                  key: 'finance',
                  icon: <DollarSign size={16} />,
                  label: "การเงิน",
                  href: "/admin/finance",
                  active: pathname === "/admin/finance" || (pathname.startsWith("/admin/finance") && !pathname.startsWith("/admin/finance/calendar"))
                },
                {
                  key: 'finance-calendar',
                  icon: <CalendarDays size={16} />,
                  label: "ปฏิทินการเงิน",
                  href: "/admin/finance/calendar",
                  active: pathname.startsWith("/admin/finance/calendar")
                },
                {
                  key: 'documents',
                  icon: <FileText size={17} />,
                  label: "บิล/เอกสาร",
                  children: [
                    {
                      key: 'documents-list',
                      icon: <List size={15} />,
                      label: "รายการเอกสาร",
                      href: "/admin/documents",
                      active: pathname === "/admin/documents" || (pathname.startsWith("/admin/documents") && !pathname.startsWith("/admin/documents/new"))
                    },
                    {
                      key: 'documents-new-invoice',
                      icon: <Receipt size={15} />,
                      label: "ใบเสร็จ/ใบกำกับภาษี",
                      href: newDocHref('invoice'),
                      active: pathname.includes('/admin/documents/new/invoice')
                    },
                    {
                      key: 'documents-new-quote',
                      icon: <FileEdit size={15} />,
                      label: "ใบเสนอราคา",
                      href: newDocHref('quote'),
                      active: pathname.includes('/admin/documents/new/quote')
                    },
                    {
                      key: 'documents-new-billing',
                      icon: <FileClock size={15} />,
                      label: "ใบแจ้งหนี้",
                      href: newDocHref('billing_note'),
                      active: pathname.includes('/admin/documents/new/billing-note')
                    },
                    {
                      key: 'documents-new-credit',
                      icon: <FileMinus size={15} />,
                      label: "ใบลดหนี้",
                      href: newDocHref('credit_note'),
                      active: pathname.includes('/admin/documents/new/credit-note')
                    },
                    {
                      key: 'documents-new-booking',
                      icon: <BookMarked size={15} />,
                      label: "ใบจอง",
                      href: newDocHref('booking_note'),
                      active: pathname.includes('/admin/documents/new/booking-note')
                    },
                  ],
                },
                {
                  key: 'accounting-docs',
                  icon: <Files size={17} />,
                  label: "เอกสารบัญชี",
                  children: [
                    {
                      key: 'accounting-list',
                      icon: <List size={15} />,
                      label: "รายการเอกสารบัญชี",
                      href: "/admin/accounting",
                      active: pathname === "/admin/accounting" || /^\/admin\/accounting\/[a-f0-9]{24}/i.test(pathname)
                    },
                    {
                      key: 'accounting-new-wht',
                      icon: <FileSpreadsheet size={15} />,
                      label: "หนังสือรับรองหัก ณ ที่จ่าย",
                      href: "/admin/accounting/new/withholding",
                      active: pathname.startsWith("/admin/accounting/new/withholding")
                    },
                    {
                      key: 'accounting-new-pv',
                      icon: <FileMinus size={15} />,
                      label: "ใบสำคัญจ่าย",
                      href: "/admin/accounting/new/payment-voucher",
                      active: pathname.startsWith("/admin/accounting/new/payment-voucher")
                    },
                    {
                      key: 'accounting-new-rv',
                      icon: <Receipt size={15} />,
                      label: "ใบสำคัญรับ",
                      href: "/admin/accounting/new/receipt-voucher",
                      active: pathname.startsWith("/admin/accounting/new/receipt-voucher")
                    },
                  ],
                },
                {
                  key: 'reports',
                  icon: <BarChart2 size={16} />,
                  label: "รายงาน",
                  href: "/admin/reports",
                  active: pathname.startsWith("/admin/reports")
                },
              ],
            },
            {
              key: 'purchasing-dept',
              icon: <ClipboardList size={17} />,
              label: "ฝ่ายจัดซื้อ",
              children: [
                {
                  key: 'purchasing',
                  icon: <ShoppingBag size={16} />,
                  label: "จัดซื้อ",
                  href: "/admin/purchasing",
                  active: pathname.startsWith("/admin/purchasing")
                },
                {
                  key: 'warehouse',
                  icon: <Warehouse size={16} />,
                  label: "คลังสินค้า",
                  href: "/admin/warehouse",
                  active: pathname.startsWith("/admin/warehouse")
                },
                {
                  key: 'products',
                  icon: <Package size={16} />,
                  label: "สินค้า/สต๊อก",
                  href: "/admin/products",
                  active: pathname.startsWith("/admin/products")
                },
              ],
            },
          ],
        },
        {
          key: 'customers',
          icon: <Users size={18} />,
          label: "ลูกค้า",
          href: "/admin/customers",
          active: pathname.startsWith("/admin/customers")
        },
      ]
    },
    {
      title: "บุคคล",
      items: [
        { key: 'staff', icon: <UserCircle size={18} />, label: "พนักงาน", href: "/admin/staff", active: pathname.startsWith("/admin/staff") },
        { key: 'shifts', icon: <CalendarRange size={18} />, label: "เวรงาน", href: "/admin/shifts", active: pathname.startsWith("/admin/shifts") },
        { key: 'attendance', icon: <CalendarClock size={18} />, label: "ลงเวลา", href: "/admin/attendance", active: pathname.startsWith("/admin/attendance") },
        { key: 'leave', icon: <CalendarOff size={18} />, label: "การลา", href: "/admin/leave", active: pathname.startsWith("/admin/leave") },
        { key: 'payroll', icon: <CalendarDays size={18} />, label: "เงินเดือน", href: "/admin/payroll", active: pathname.startsWith("/admin/payroll") },
      ]
    },
    {
      title: "การตั้งค่า",
      items: [
        { key: 'settings', icon: <Settings size={18} />, label: "ตั้งค่าทั่วไป", href: "/admin/settings", active: pathname === "/admin/settings" },
        { key: 'admin-users', icon: <ShieldCheck size={18} />, label: "จัดการ Admin", href: "/admin/users", active: pathname.startsWith("/admin/users") },
        { key: 'profile', icon: <UserCircle2 size={18} />, label: "โปรไฟล์ของฉัน", href: "/admin/profile", active: pathname.startsWith("/admin/profile") },
      ]
    }
  ];

  const toggle = (key: string) => {
    setToggled(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // เปิดอัตโนมัติถ้ามีหน้าปัจจุบันอยู่ข้างใน เว้นแต่ผู้ใช้จะกดปิด
  const isNodeExpanded = (node: NavNode) => hasActiveDescendant(node) !== toggled.has(node.key);

  const renderNode = (node: NavNode, depth: number) => {
    const hasActiveChild = hasActiveDescendant(node);

    // ── กรณีเป็นกลุ่มเมนูที่มีลูก (Accordion Parent) ──
    if (node.children) {
      const isExpanded = isNodeExpanded(node);

      if (!isOpen) {
        // แถบย่อไอคอน: คลิกเพื่อไปหน้าแรกของกลุ่ม
        return (
          <li key={node.key}>
            <Link
              href={getFirstHref(node)}
              title={node.label}
              className={`flex items-center justify-center p-2 rounded-lg transition-colors
                ${hasActiveChild ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}
              `}
            >
              <span className={hasActiveChild ? 'text-blue-600' : 'text-slate-400'}>{node.icon}</span>
            </Link>
          </li>
        );
      }

      // ปรับขนาดและสไตล์ตามระดับชั้น (Depth)
      const isRootParent = depth === 0;
      const textClass = isRootParent
        ? 'text-[13.5px] font-medium'
        : 'text-[13px] font-medium';

      return (
        <li key={node.key} className="space-y-0.5">
          <button
            type="button"
            onClick={() => toggle(node.key)}
            className={`group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 text-left select-none
              ${hasActiveChild
                ? 'text-slate-900 font-semibold hover:bg-slate-100/70'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }
              ${textClass}
            `}
          >
            <span
              className={`shrink-0 transition-colors ${
                hasActiveChild ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}
            >
              {node.icon}
            </span>
            <span className="flex-1 truncate">{node.label}</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                isExpanded ? 'rotate-180 text-slate-600' : 'group-hover:text-slate-600'
              }`}
            />
          </button>

          {/* Sub-tree List with Vertical Hierarchy Line */}
          {isExpanded && (
            <ul className="ml-4 pl-2.5 border-l border-slate-200/80 space-y-0.5 py-0.5">
              {node.children.map(child => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    // ── กรณีเป็นเมนูปลายทาง (Leaf Link Item) ──
    const isActive = !!node.active;
    const itemTextClass = depth === 0
      ? 'text-[13.5px]'
      : depth === 1
      ? 'text-[13px]'
      : 'text-[12.5px]';

    return (
      <li key={node.key}>
        <Link
          href={node.href || "#"}
          title={!isOpen ? node.label : undefined}
          className={`group flex items-center gap-2.5 py-2 rounded-lg transition-all duration-150 relative
            ${isActive
              ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-normal'
            }
            ${isOpen ? 'px-2.5' : 'justify-center px-0'}
            ${itemTextClass}
          `}
        >
          {/* Active Accent Dot/Indicator for deeper items */}
          {isActive && isOpen && depth > 0 && (
            <span className="absolute -left-[11px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 ring-2 ring-white" />
          )}

          <span
            className={`shrink-0 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
            }`}
          >
            {node.icon}
          </span>
          {isOpen && <span className="flex-1 truncate">{node.label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={`${isOpen ? 'w-[250px]' : 'w-18'}
      bg-white text-slate-600 flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 border-r border-slate-200/90 select-none`}
    >
      {/* Logo Area */}
      <div className={`flex items-center h-16 shrink-0 border-b border-slate-100 ${isOpen ? 'px-4 justify-start' : 'px-2 justify-center'}`}>
        <Link href="/admin" className="flex items-center gap-2.5 min-w-0 group">
          <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs group-hover:border-blue-200 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/logo.png" alt="Kosoku" className="w-6 h-6 object-contain" />
          </div>
          {isOpen && (
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm leading-tight truncate">Kosoku</div>
              <div className="text-[11px] text-slate-400 leading-tight truncate">ระบบจัดการหลังบ้าน</div>
            </div>
          )}
        </Link>
      </div>

      {/* Menu List */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 sidebar-scroll"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style>{`
          .sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="space-y-5">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {isOpen && (
                <div className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2.5">
                  {group.title}
                </div>
              )}

              <ul className="space-y-0.5">
                {group.items.map(item => renderNode(item, 0))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Help Center Footer Card */}
      <div className="p-2.5 mt-auto border-t border-slate-100 bg-slate-50/50">
        <div className={`rounded-lg flex items-center gap-2.5 cursor-pointer hover:bg-slate-100/80 transition-colors
          ${isOpen ? 'p-2' : 'p-1.5 justify-center'}
        `}>
          <div className="bg-blue-50 p-2 rounded-md text-blue-600 shrink-0 border border-blue-100/50">
            <HeadphonesIcon size={16} />
          </div>
          {isOpen && (
            <div className="overflow-hidden min-w-0">
              <div className="text-xs font-semibold text-slate-800 truncate">ศูนย์ช่วยเหลือ</div>
              <div className="text-[11px] text-slate-400 truncate">ติดต่อฝ่ายเทคนิค</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
