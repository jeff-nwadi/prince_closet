import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { orders, user, orderItems, products } from '@/lib/db/schema';
import { desc, count, sum, eq, gte } from 'drizzle-orm';

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
    // Monthly revenue and order counts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [allOrders, allProducts, allOrderItems] = await Promise.all([
      db.select({
        totalAmount: orders.totalAmount,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
        status: orders.status,
      }).from(orders).where(gte(orders.createdAt, sixMonthsAgo)),
      db.select({ id: products.id, name: products.name, price: products.price }).from(products),
      db.select({ productId: orderItems.productId, productName: orderItems.productName, quantity: orderItems.quantity, price: orderItems.price })
        .from(orderItems),
    ]);

    // Aggregate by month (last 6 months)
    const monthlyData: Record<string, { revenue: number; orderCount: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = { revenue: 0, orderCount: 0 };
    }

    for (const o of allOrders) {
      const d = new Date(o.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData[key]) {
        monthlyData[key].orderCount++;
        if (o.paymentStatus === 'paid') {
          monthlyData[key].revenue += Number(o.totalAmount ?? 0);
        }
      }
    }

    const months = Object.keys(monthlyData).sort();
    const revenueData = months.map((m) => monthlyData[m].revenue);
    const ordersData = months.map((m) => monthlyData[m].orderCount);
    const monthLabels = months.map((m) => {
      const [y, mo] = m.split('-');
      return new Date(Number(y), Number(mo) - 1).toLocaleString('en-US', { month: 'short' });
    });

    // Top products by total revenue from order_items
    const productRevMap: Record<string, { name: string; qty: number; revenue: number }> = {};
    for (const item of allOrderItems) {
      const key = item.productId;
      if (!productRevMap[key]) {
        productRevMap[key] = { name: item.productName, qty: 0, revenue: 0 };
      }
      const qty = Number(item.quantity ?? 1);
      const price = Number(item.price ?? 0);
      productRevMap[key].qty += qty;
      productRevMap[key].revenue += qty * price;
    }

    const topProducts = Object.values(productRevMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const totalRevenue = topProducts.reduce((s, p) => s + p.revenue, 0) || 1;
    const topProductsWithPct = topProducts.map((p) => ({
      name: p.name,
      sales: p.qty,
      revenue: `₦${p.revenue.toLocaleString('en-NG')}`,
      pct: Math.round((p.revenue / totalRevenue) * 100),
    }));

    // Overall KPIs
    const totalRevAll = allOrders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((s, o) => s + Number(o.totalAmount ?? 0), 0);
    const totalOrdCount = allOrders.length;
    const avgOrderValue = totalOrdCount > 0 ? Math.round(totalRevAll / totalOrdCount) : 0;
    const returnRate = totalOrdCount > 0
      ? ((allOrders.filter((o) => o.status === 'returned').length / totalOrdCount) * 100).toFixed(1)
      : '0.0';

    return NextResponse.json({
      monthLabels,
      revenueData,
      ordersData,
      topProducts: topProductsWithPct,
      kpis: {
        totalRevenue: totalRevAll,
        totalOrders: totalOrdCount,
        avgOrderValue,
        returnRate: Number(returnRate),
      },
    });
  } catch (err) {
    console.error('[admin/analytics GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
