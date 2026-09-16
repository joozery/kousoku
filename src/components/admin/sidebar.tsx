"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Users, Car, Package,
  ShoppingBag, Warehouse, FileText, DollarSign,
  UserCircle, UserCircle2, CalendarDays, BarChart2, Settings,
  HeadphonesIcon, ChevronRight, ShieldCheck, Tag,
  CalendarClock, CalendarOff, Wrench,
  CalendarRange, Shield,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

export function AdminSidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuGroups = [
    {
      title: "เมนูหลัก",
      items: [
        { icon: <Home size={20} />, label: "หน้าหลัก", href: "/admin", active: pathname === "/admin" },
        { icon: <BarChart2 size={20} />, label: "รายงาน", href: "/admin/reports", active: pathname.startsWith("/admin/reports"), hasSub: true },
        { icon: <DollarSign size={20} />, label: "การเงิน", href: "/admin/finance", active: pathname.startsWith("/admin/finance"), hasSub: true },
        { icon: <FileText size={20} />, label: "บิล/เอกสาร", href: "/admin/documents", active: pathname.startsWith("/admin/documents") && !pathname.startsWith("/admin/documents/settings/services"), hasSub: true },
        { icon: <ShoppingBag size={20} />, label: "จัดซื้อ", href: "/admin/purchasing", active: pathname === "/admin/purchasing" },
        { icon: <Warehouse size={20} />, label: "คลังสินค้า", href: "/admin/warehouse", active: pathname === "/admin/warehouse" },
        { icon: <Package size={20} />, label: "สินค้า/สต๊อก", href: "/admin/products", active: pathname.startsWith("/admin/products") },
        { icon: <Users size={20} />, label: "ลูกค้า", href: "/admin/customers", active: pathname === "/admin/customers" },
      ]
    },
    {
      title: "ระบบหน้าร้าน",
      items: [
        { icon: <Shield size={20} />, label: "เครมประกัน", href: "/admin/warranty-claims", active: pathname.startsWith("/admin/warranty-claims") },
        { icon: <Car size={20} />, label: "ยี่ห้อ/รุ่นรถ", href: "/admin/car-data", active: pathname.startsWith("/admin/car-data") },
        { icon: <Wrench size={20} />, label: "บริการ/ค่าแรง", href: "/admin/documents/settings/services", active: pathname.startsWith("/admin/documents/settings/services") },
        { icon: <Tag size={20} />, label: "แบรนด์สินค้า", href: "/admin/brands", active: pathname.startsWith("/admin/brands") },
      ]
    },
    {
      title: "บุคคล",
      items: [
        { icon: <UserCircle size={20} />, label: "พนักงาน", href: "/admin/staff", active: pathname === "/admin/staff" },
        { icon: <CalendarRange size={20} />, label: "เวรงาน", href: "/admin/shifts", active: pathname.startsWith("/admin/shifts") },
        { icon: <CalendarClock size={20} />, label: "ลงเวลา", href: "/admin/attendance", active: pathname === "/admin/attendance" },
        { icon: <CalendarOff size={20} />, label: "การลา", href: "/admin/leave", active: pathname === "/admin/leave" },
        { icon: <CalendarDays size={20} />, label: "เงินเดือน", href: "/admin/payroll", active: pathname === "/admin/payroll" },
      ]
    },
    {
      title: "การตั้งค่า",
      items: [
        { icon: <Settings size={20} />, label: "ตั้งค่าทั่วไป", href: "/admin/settings", active: pathname === "/admin/settings" },
        { icon: <ShieldCheck size={20} />, label: "จัดการ Admin", href: "/admin/users", active: pathname.startsWith("/admin/users") },
        { icon: <UserCircle2 size={20} />, label: "โปรไฟล์ของฉัน", href: "/admin/profile", active: pathname.startsWith("/admin/profile") },
      ]
    }
  ];

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
                {group.items.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.href || "#"}
                      title={!isOpen ? item.label : undefined}
                      className={`flex items-center gap-3 py-2.5 rounded-lg transition-colors text-sm font-medium
                        ${item.active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }
                        ${isOpen ? 'px-3' : 'justify-center px-0'}
                      `}
                    >
                      <span className={item.active ? 'text-blue-600' : 'text-slate-400'}>
                        {item.icon}
                      </span>

                      {isOpen && (
                        <>
                          <span className="flex-1 whitespace-nowrap">{item.label}</span>
                          {item.hasSub && (
                            <ChevronRight size={14} className="text-slate-300" />
                          )}
                        </>
                      )}
                    </Link>
                  </li>
                ))}
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
