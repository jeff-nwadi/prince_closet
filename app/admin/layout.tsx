import AdminLayoutClientWrapper from './AdminLayoutClientWrapper';

export const metadata = {
  title: 'Admin Dashboard | StyleAdmin',
  description: 'Admin panel for clothing store',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClientWrapper>{children}</AdminLayoutClientWrapper>;
}

