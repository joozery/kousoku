"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import {
  Home, Users, Car, Package,
  ShoppingBag, Warehouse, FileText, DollarSign,
  UserCircle, UserCircle2, CalendarDays, BarChart2, Settings,
  HeadphonesIcon, ChevronDown, ShieldCheck, Tag,
  CalendarClock, CalendarOff, Wrench,
  CalendarRange, Shield, Landmark, ClipboardList,
} from 'lucide-react';

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
  // เก็บเฉพาะกลุ่มที่ผู้ใช้ "สลับ" สถานะเอง ส่วนค่าเริ่มต้นจะเปิดอัตโนมัติถ้ามีหน้าปัจจุบันอยู่ข้างใน
  const [toggled, setToggled] = useState<Set<string>>(new Set());

  const menuGroups: { title: string; items: NavNode[] }[] = [
    {
      title: "เมนูหลัก",
      items: [
        { key: 'home', icon: <Home size={20} />, label: "หน้าหลัก", href: "/admin", active: pathname === "/admin" },
        {
          key: 'finance-root',
          icon: <DollarSign size={20} />,
          label: "การเงิน",
          children: [
            {
              key: 'accounting',
              icon: <Landmark size={18} />,
              label: "ฝ่ายบัญชี",
              children: [
                { key: 'finance', icon: <DollarSign size={18} />, label: "การเงิน", href: "/admin/finance", active: pathname.startsWith("/admin/finance") },
                { key: 'documents', icon: <FileText size={18} />, label: "บิล/เอกสาร", href: "/admin/documents", active: pathname.startsWith("/admin/documents") && !pathname.startsWith("/admin/documents/settings/services") },
                { key: 'reports', icon: <BarChart2 size={18} />, label: "รายงาน", href: "/admin/reports", active: pathname.startsWith("/admin/reports") },
              ],
            },
            {
              key: 'purchasing-dept',
              icon: <ClipboardList size={18} />,
              label: "ฝ่ายจัดซื้อ",
              children: [
                { key: 'purchasing', icon: <ShoppingBag size={18} />, label: "จัดซื้อ", href: "/admin/purchasing", active: pathname === "/admin/purchasing" },
                { key: 'warehouse', icon: <Warehouse size={18} />, label: "คลังสินค้า", href: "/admin/warehouse", active: pathname === "/admin/warehouse" },
                { key: 'products', icon: <Package size={18} />, label: "สินค้า/สต๊อก", href: "/admin/products", active: pathname.startsWith("/admin/products") },
              ],
            },
          ],
        },
        { key: 'customers', icon: <Users size={20} />, label: "ลูกค้า", href: "/admin/customers", active: pathname === "/admin/customers" },
      ]
    },
    {
      title: "ระบบหน้าร้าน",
      items: [
        { key: 'warranty', icon: <Shield size={20} />, label: "เครมประกัน", href: "/admin/warranty-claims", active: pathname.startsWith("/admin/warranty-claims") },
        { key: 'car-data', icon: <Car size={20} />, label: "ยี่ห้อ/รุ่นรถ", href: "/admin/car-data", active: pathname.startsWith("/admin/car-data") },
        { key: 'services', icon: <Wrench size={20} />, label: "บริการ/ค่าแรง", href: "/admin/documents/settings/services", active: pathname.startsWith("/admin/documents/settings/services") },
        { key: 'brands', icon: <Tag size={20} />, label: "แบรนด์สินค้า", href: "/admin/brands", active: pathname.startsWith("/admin/brands") },
      ]
    },
    {
      title: "บุคคล",
      items: [
        { key: 'staff', icon: <UserCircle size={20} />, label: "พนักงาน", href: "/admin/staff", active: pathname === "/admin/staff" },
        { key: 'shifts', icon: <CalendarRange size={20} />, label: "เวรงาน", href: "/admin/shifts", active: pathname.startsWith("/admin/shifts") },
        { key: 'attendance', icon: <CalendarClock size={20} />, label: "ลงเวลา", href: "/admin/attendance", active: pathname === "/admin/attendance" },
        { key: 'leave', icon: <CalendarOff size={20} />, label: "การลา", href: "/admin/leave", active: pathname === "/admin/leave" },
        { key: 'payroll', icon: <CalendarDays size={20} />, label: "เงินเดือน", href: "/admin/payroll", active: pathname === "/admin/payroll" },
      ]
    },
    {
      title: "การตั้งค่า",
      items: [
        { key: 'settings', icon: <Settings size={20} />, label: "ตั้งค่าทั่วไป", href: "/admin/settings", active: pathname === "/admin/settings" },
        { key: 'admin-users', icon: <ShieldCheck size={20} />, label: "จัดการ Admin", href: "/admin/users", active: pathname.startsWith("/admin/users") },
        { key: 'profile', icon: <UserCircle2 size={20} />, label: "โปรไฟล์ของฉัน", href: "/admin/profile", active: pathname.startsWith("/admin/profile") },
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

  // เปิดโดยอัตโนมัติถ้ามีหน้าปัจจุบันอยู่ข้างใน เว้นแต่ผู้ใช้จะกดปิดเอง (และกลับกัน)
  const isNodeExpanded = (node: NavNode) => hasActiveDescendant(node) !== toggled.has(node.key);

  const renderNode = (node: NavNode, depth: number) => {
    const isActive = hasActiveDescendant(node);
    const paddingLeft = isOpen ? 12 + depth * 16 : undefined;

    if (node.children) {
      const isExpanded = isNodeExpanded(node);

      if (!isOpen) {
        // แถบย่อไอคอน: ไม่มีที่ว่างสำหรับเมนูย่อย ให้คลิกไปหน้าแรกของกลุ่มแทน
        return (
          <li key={node.key}>
            <Link
              href={getFirstHref(node)}
              title={node.label}
              className={`flex items-center justify-center px-0 py-2.5 rounded-lg transition-colors text-sm font-medium
                ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
              `}
            >
              <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{node.icon}</span>
            </Link>
          </li>
        );
      }

      return (
        <li key={node.key}>
          <button
            type="button"
            onClick={() => toggle(node.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
              ${isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
            style={paddingLeft !== undefined ? { paddingLeft } : undefined}
          >
            <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>{node.icon}</span>
            <span className="flex-1 text-left whitespace-nowrap">{node.label}</span>
            <ChevronDown
              size={14}
              className={`text-slate-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>

          {isExpanded && (
            <ul className="space-y-0.5 mt-0.5">
              {node.children.map(child => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={node.key}>
        <Link
          href={node.href || "#"}
          title={!isOpen ? node.label : undefined}
          className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors text-sm font-medium
            ${node.active
              ? 'bg-blue-50 text-blue-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            }
            ${isOpen ? 'px-3' : 'justify-center px-0'}
          `}
          style={paddingLeft !== undefined ? { paddingLeft } : undefined}
        >
          <span className={node.active ? 'text-blue-600' : 'text-slate-400'}>{node.icon}</span>
          {isOpen && <span className="flex-1 whitespace-nowrap">{node.label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <aside
      className={`${isOpen ? 'w-[260px]' : 'w-20'}
      bg-white text-slate-600 flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 border-r border-slate-200`}
    >
      {/* Logo Area */}
      <div className={`flex items-center h-[72px] shrink-0 border-b border-slate-100 ${isOpen ? 'px-5 justify-start' : 'px-2 justify-center'}`}>
        <Link href="/admin" className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-50 ring-1 ring-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            <img src="/logo/logo.png" alt="Kosoku" className="w-7 h-7 object-contain" />
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
        className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 sidebar-scroll"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <style>{`
          .sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="space-y-6">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              <div className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3 ${!isOpen && 'text-center hidden'}`}>
                {isOpen ? group.title : ''}
              </div>

              <ul className="space-y-0.5">
                {group.items.map(item => renderNode(item, 0))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Help Center */}
      <div className="p-3 mt-auto border-t border-slate-100">
        <div className={`rounded-lg flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors
          ${isOpen ? 'p-3' : 'p-2 justify-center'}
        `}>
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 shrink-0">
            <HeadphonesIcon size={18} />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-slate-700 whitespace-nowrap">ศูนย์ช่วยเหลือ</div>
              <div className="text-xs text-slate-400 whitespace-nowrap">ติดต่อทีมงาน</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
