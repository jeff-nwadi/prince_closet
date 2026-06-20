import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { user, orders } from '@/lib/db/schema';
import { desc, count, eq, sum } from 'drizzle-orm';

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

  try {
    const customers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(100);

    // Get order counts and total spend per user
    const orderStats = await db
      .select({
        userId: orders.userId,
        orderCount: count(),
        totalSpent: sum(orders.totalAmount),
      })
      .from(orders)
      .where(eq(orders.paymentStatus, 'paid'))
      .groupBy(orders.userId);

    const statsMap = Object.fromEntries(
      orderStats.map((s) => [s.userId, { orderCount: s.orderCount, totalSpent: Number(s.totalSpent ?? 0) }])
    );

    const enriched = customers.map((c) => ({
      ...c,
      orderCount: statsMap[c.id]?.orderCount ?? 0,
      totalSpent: statsMap[c.id]?.totalSpent ?? 0,
    }));

    return NextResponse.json({ customers: enriched });
  } catch (err) {
    console.error('[admin/customers] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
