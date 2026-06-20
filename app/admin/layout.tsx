import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';

export const metadata = {
  title: 'Admin Dashboard | StyleAdmin',
  description: 'Admin panel for clothing store',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
