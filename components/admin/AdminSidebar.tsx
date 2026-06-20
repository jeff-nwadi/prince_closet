'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingBag, Package, Users,
  Archive, Tag, Truck, Undo2, BarChart3, FileText,
  Settings, Shirt, LogOut, LucideIcon
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: '' },
      { name: 'Products', href: '/admin/products', icon: Package },
      { name: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    title: 'Store',
    items: [
      { name: 'Inventory', href: '/admin/inventory', icon: Archive, badge: '', badgeColor: 'bg-red-500' },
      { name: 'Discounts', href: '/admin/discounts', icon: Tag },
      { name: 'Shipping', href: '/admin/shipping', icon: Truck },
      { name: 'Returns', href: '/admin/returns', icon: Undo2 },
    ],
  },
  {
    title: 'Insights',
    items: [
      { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      { name: 'Reports', href: '/admin/reports', icon: FileText },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <aside className="w-[200px] bg-[#4a3129] h-screen fixed left-0 top-0 flex flex-col border-r border-[#dfcac3]/20 z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[#dfcac3]/10 flex-shrink-0">
        <Link href="/admin" className="flex items-center gap-2 text-[#f4f0ea]">
          <Shirt size={20} strokeWidth={2} />
          <span className="font-bold tracking-widest uppercase text-sm">StyleAdmin</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#dfcac3]/60 mb-3 px-2">
              {section.title}
            </h3>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-2 py-2 transition-colors border-l-2 ${
                      isActive
                        ? 'bg-[#3A241C] text-white border-[#dfcac3]'
                        : 'text-[#dfcac3] hover:bg-[#3A241C]/50 hover:text-white border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${item.badgeColor || 'bg-white/20'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t border-[#dfcac3]/10">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-2 py-2 text-[#dfcac3]/70 hover:text-white hover:bg-[#3A241C]/50 transition-colors"
        >
          <LogOut size={15} strokeWidth={2} />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
        <div className="text-[10px] text-[#dfcac3]/40 uppercase tracking-widest text-center mt-3">
          Prince's Closet
        </div>
      </div>
    </aside>
  );
}
