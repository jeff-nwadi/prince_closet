import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { orders, user, orderItems } from '@/lib/db/schema';
import { desc, count, eq, or, ilike } from 'drizzle-orm';

function isAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search');

  try {
    let query = db
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        shippingName: orders.shippingName,
        shippingCity: orders.shippingCity,
        customerEmail: user.email,
        customerId: user.id,
      })
      .from(orders)
      .leftJoin(user, eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt))
      .$dynamic();

    if (statusFilter && statusFilter !== 'all') {
      query = query.where(eq(orders.status, statusFilter));
    }

    const allOrders = await query.limit(100);

    // Item counts per order
    const itemCounts = await db
      .select({ orderId: orderItems.orderId, count: count() })
      .from(orderItems)
      .groupBy(orderItems.orderId);

    const itemCountMap = Object.fromEntries(itemCounts.map((i) => [i.orderId, i.count]));

    let enriched = allOrders.map((o) => ({
      ...o,
      itemCount: itemCountMap[o.id] ?? 0,
    }));

    // Client-side search filter (name or order number)
    if (search) {
      const q = search.toLowerCase();
      enriched = enriched.filter(
        (o) =>
          (o.shippingName ?? '').toLowerCase().includes(q) ||
          o.orderNumber.toLowerCase().includes(q) ||
          (o.customerEmail ?? '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ orders: enriched });
  } catch (err) {
    console.error('[admin/orders] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update order status
export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allowedStatuses = ['processing', 'in-transit', 'delivered', 'cancelled'];

  try {
    const body = await request.json();
    const { orderId, status } = body as { orderId?: string; status?: string };

    if (!orderId || typeof orderId !== 'string') {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/orders PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
