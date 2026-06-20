import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/db';
import { orders, user, orderItems, products, returns } from '@/lib/db/schema';
import { desc, count, sum, eq, sql } from 'drizzle-orm';
import DashboardStats from '@/components/admin/DashboardStats';
import RecentOrdersTable from '@/components/admin/RecentOrdersTable';
import InventoryAlerts from '@/components/admin/InventoryAlerts';
import PendingReturns from '@/components/admin/PendingReturns';

function isAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

async function getDashboardData() {
  const [revenueResult, ordersCount, pendingCount, customersCount, recentOrders, itemCounts, lowStockItems, pendingReturns] =
    await Promise.all([
      db.select({ total: sql<string>`coalesce(sum(${orders.totalAmount}), 0)` })
        .from(orders)
        .where(eq(orders.paymentStatus, 'paid')),
      db.select({ count: count() }).from(orders),
      db.select({ count: count() }).from(orders).where(eq(orders.status, 'processing')),
      db.select({ count: count() }).from(user),
      db.select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        shippingName: orders.shippingName,
        customerEmail: user.email,
      }).from(orders).leftJoin(user, eq(orders.userId, user.id)).orderBy(desc(orders.createdAt)).limit(5),
      db.select({ orderId: orderItems.orderId, cnt: count() }).from(orderItems).groupBy(orderItems.orderId),
      db.select({
        id: products.id,
        emoji: products.emoji,
        name: products.name,
        stock: products.stock,
        threshold: products.threshold,
      }).from(products).where(sql`${products.stock} <= ${products.threshold}`).limit(5),
      db.select({
        id: returns.id,
        productEmoji: returns.productEmoji,
        productName: returns.productName,
        orderNumber: returns.orderNumber,
        customerName: returns.customerName,
        reason: returns.reason,
        amount: returns.amount,
      }).from(returns).where(eq(returns.status, 'Pending')).orderBy(desc(returns.createdAt)).limit(3),
    ]);

  const itemCountMap = Object.fromEntries(itemCounts.map((i) => [i.orderId, i.cnt]));

  return {
    stats: {
      totalRevenue: Number(revenueResult[0]?.total ?? 0),
      totalOrders: Number(ordersCount[0]?.count ?? 0),
      pendingOrders: Number(pendingCount[0]?.count ?? 0),
      totalCustomers: Number(customersCount[0]?.count ?? 0),
      lowStockCount: lowStockItems.length,
    },
    recentOrders: recentOrders.map((o) => ({ ...o, itemCount: itemCountMap[o.id] ?? 0 })),
    lowStockItems,
    pendingReturns,
  };
}

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || !isAdmin(session.user.email)) redirect('/admin/login');

  const { stats, recentOrders, lowStockItems, pendingReturns } = await getDashboardData();

  return (
    <div>
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <RecentOrdersTable orders={recentOrders} />
        </div>
        <div className="xl:col-span-2 flex flex-col gap-6">
          <InventoryAlerts items={lowStockItems} />
          <PendingReturns items={pendingReturns} />
        </div>
      </div>
    </div>
  );
}
