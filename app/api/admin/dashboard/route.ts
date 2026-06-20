import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { orders, user, orderItems, products, returns } from '@/lib/db/schema';
import { desc, count, sum, sql, eq, lte } from 'drizzle-orm';

function isAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const [revenueResult, ordersCountResult, pendingResult, customersResult, recentOrders, itemCounts, lowStockItems, pendingReturns] =
      await Promise.all([
        db.select({ total: sum(orders.totalAmount) }).from(orders).where(eq(orders.paymentStatus, 'paid')),
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
        })
          .from(orders)
          .leftJoin(user, eq(orders.userId, user.id))
          .orderBy(desc(orders.createdAt))
          .limit(5),
        db.select({ orderId: orderItems.orderId, count: count() })
          .from(orderItems).groupBy(orderItems.orderId),
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

    const itemCountMap = Object.fromEntries(itemCounts.map((i) => [i.orderId, i.count]));

    return NextResponse.json({
      stats: {
        totalRevenue: Number(revenueResult[0]?.total ?? 0),
        totalOrders: Number(ordersCountResult[0]?.count ?? 0),
        pendingOrders: Number(pendingResult[0]?.count ?? 0),
        totalCustomers: Number(customersResult[0]?.count ?? 0),
      },
      recentOrders: recentOrders.map((o) => ({ ...o, itemCount: itemCountMap[o.id] ?? 0 })),
      lowStockItems,
      pendingReturns,
    });
  } catch (err) {
    console.error('[admin/dashboard GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
