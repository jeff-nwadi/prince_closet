import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { shipments, orders, user } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

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
    const list = await db
      .select({
        shipmentId: shipments.id,
        shipmentStatus: shipments.status,
        estimatedArrival: shipments.estimatedArrival,
        stepsJson: shipments.stepsJson,
        orderId: orders.id,
        orderNumber: orders.orderNumber,
        orderStatus: orders.status,
        shippingName: orders.shippingName,
        shippingCity: orders.shippingCity,
        shippingState: orders.shippingState,
        shippingCountry: orders.shippingCountry,
        shippingPhone: orders.shippingPhone,
        shippingAddress1: orders.shippingAddress1,
        shippingMethod: orders.shippingMethod,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
        customerEmail: user.email,
      })
      .from(shipments)
      .leftJoin(orders, eq(shipments.orderId, orders.id))
      .leftJoin(user, eq(orders.userId, user.id))
      .orderBy(desc(orders.createdAt))
      .limit(100);

    return NextResponse.json({ shipments: list });
  } catch (err) {
    console.error('[admin/shipping GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const allowedStatuses = ['pending', 'shipped', 'out-for-delivery', 'delivered', 'returned'];

  try {
    const body = await request.json();
    const { shipmentId, status, estimatedArrival, trackingNote } = body as {
      shipmentId?: string;
      status?: string;
      estimatedArrival?: string;
      trackingNote?: string;
    };

    if (!shipmentId) return NextResponse.json({ error: 'shipmentId is required' }, { status: 400 });
    if (status && !allowedStatuses.includes(status))
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });

    const updates: Partial<typeof shipments.$inferInsert> = {};
    if (status !== undefined) updates.status = status;
    if (estimatedArrival !== undefined) updates.estimatedArrival = new Date(estimatedArrival);

    if (trackingNote) {
      const shipment = await db.select({ stepsJson: shipments.stepsJson })
        .from(shipments).where(eq(shipments.id, shipmentId)).limit(1);
      const steps: string[] = shipment[0]?.stepsJson ? JSON.parse(shipment[0].stepsJson) : [];
      steps.push(`${new Date().toISOString()}: ${trackingNote}`);
      updates.stepsJson = JSON.stringify(steps);
    }

    await db.update(shipments).set(updates).where(eq(shipments.id, shipmentId));

    // Sync order status if shipment delivered
    if (status === 'delivered') {
      const ship = await db.select({ orderId: shipments.orderId })
        .from(shipments).where(eq(shipments.id, shipmentId)).limit(1);
      if (ship[0]) {
        await db.update(orders).set({ status: 'delivered', updatedAt: new Date() })
          .where(eq(orders.id, ship[0].orderId));
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/shipping PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
