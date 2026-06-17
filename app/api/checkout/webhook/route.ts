import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { orders, shipments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing from environment variables');
      return NextResponse.json({ error: 'Gateway configuration error' }, { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    if (!signature) {
      console.error('Missing x-paystack-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    // Get the raw request body to compute the HMAC
    const rawBody = await req.text();
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(rawBody)
      .digest('hex');

    // Verify signature integrity
    if (hash !== signature) {
      console.error('Webhook signature verification failed');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Only process charge.success events
    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      
      if (!reference) {
        console.error('No reference found in webhook data');
        return NextResponse.json({ error: 'No reference' }, { status: 400 });
      }

      // Check order
      const existingOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.paymentReference, reference))
        .limit(1);

      if (existingOrders.length === 0) {
        console.error(`Order with reference ${reference} not found in database`);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const order = existingOrders[0];

      // If the order has already been marked as paid (e.g. by redirect verification), return 200 OK
      if (order.paymentStatus === 'paid') {
        return NextResponse.json({ received: true, status: 'already_processed' });
      }

      // Update order status in a transaction or sequential steps
      await db
        .update(orders)
        .set({
          paymentStatus: 'paid',
          status: 'processing',
          updatedAt: new Date(),
        })
        .where(eq(orders.id, order.id));

      // Create tracking shipment
      const estimatedArrival = new Date();
      estimatedArrival.setDate(estimatedArrival.getDate() + 5);

      const defaultSteps = [
        { label: 'Order Placed', completed: true, active: false },
        { label: 'Shipped', completed: false, active: true },
        { label: 'In Transit', completed: false, active: false },
        { label: 'Out for Delivery', completed: false, active: false },
        { label: 'Delivered', completed: false, active: false },
      ];

      await db.insert(shipments).values({
        id: crypto.randomUUID(),
        orderId: order.id,
        status: 'shipped',
        estimatedArrival,
        stepsJson: JSON.stringify(defaultSteps),
      });

      console.log(`Order ${order.orderNumber} successfully paid and updated via webhook`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Paystack webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
