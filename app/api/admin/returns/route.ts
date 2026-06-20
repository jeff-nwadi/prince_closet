import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { returns, orders } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    const list = await db
      .select()
      .from(returns)
      .orderBy(desc(returns.createdAt));

    return NextResponse.json({ returns: list });
  } catch (err) {
    console.error('[admin/returns GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const allowedStatuses = ['Pending', 'Approved', 'Rejected'];

  try {
    const body = await request.json();
    const { id, status } = body as { id?: string; status?: string };

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    if (!status || !allowedStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 1. Get the return details
    const targetReturn = await db
      .select({ orderId: returns.orderId })
      .from(returns)
      .where(eq(returns.id, id))
      .limit(1);

    if (targetReturn.length === 0) {
      return NextResponse.json({ error: 'Return request not found' }, { status: 404 });
    }

    // 2. Update status of the return request
    await db.update(returns).set({ status }).where(eq(returns.id, id));

    // 3. If approved, update the corresponding order status to 'returned'
    if (status === 'Approved') {
      await db
        .update(orders)
        .set({ status: 'returned', updatedAt: new Date() })
        .where(eq(orders.id, targetReturn[0].orderId));
    } else if (status === 'Pending' || status === 'Rejected') {
      // Revert order status back to processing or delivered if return is pending or rejected
      await db
        .update(orders)
        .set({ status: 'processing', updatedAt: new Date() })
        .where(eq(orders.id, targetReturn[0].orderId));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/returns PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
