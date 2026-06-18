'use client';

import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminTopBar() {
  const pathname = usePathname();
  
  // Create a nice title from the pathname
  let title = 'Dashboard';
  if (pathname !== '/admin') {
    const segment = pathname.split('/').pop() || '';
    title = segment.charAt(0).toUpperCase() + segment.slice(1);
  }

  return (
    <header className="h-16 bg-[#f4f0ea] flex items-center justify-between px-8 border-b border-[#dfcac3]/40 sticky top-0 z-40">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-[#4a3129] font-bold text-xl tracking-tight">{title}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <button className="text-[#4a3129]/60 hover:text-[#4a3129] transition-colors">
          <Search size={18} strokeWidth={2} />
        </button>
        
        <button className="text-[#4a3129]/60 hover:text-[#4a3129] transition-colors relative">
          <Bell size={18} strokeWidth={2} />
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-[#f4f0ea]"></span>
        </button>

        <div className="h-8 w-px bg-[#dfcac3]/50 mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-[#4a3129] group-hover:text-[#4a3129]/80 transition-colors">Admin User</p>
            <p className="text-[10px] text-[#4a3129]/60 uppercase tracking-widest">Manager</p>
          </div>
          <div className="h-8 w-8 rounded-none bg-[#4a3129] flex items-center justify-center text-white text-xs font-bold tracking-wider">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
