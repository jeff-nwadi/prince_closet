'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

export default function AdminLayoutClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f4f0ea]">
      <AdminSidebar />
      <div className="flex-1 ml-[200px] flex flex-col min-h-screen">
        <AdminTopBar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
