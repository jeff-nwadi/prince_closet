import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { orders, shipments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  if (!reference) {
    console.error('No reference provided for verification');
    return NextResponse.redirect(new URL('/checkout?error=missing_reference', req.url));
  }

  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing from environment variables');
      return NextResponse.redirect(new URL('/checkout?error=gateway_configuration', req.url));
    }

    // Call Paystack verification API
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
      },
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status || paystackData.data.status !== 'success') {
      console.error('Paystack verification failed:', paystackData);
      return NextResponse.redirect(new URL('/checkout?error=payment_failed', req.url));
    }

    // Find the corresponding order by paymentReference (which we set to orderNumber)
    const existingOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentReference, reference))
      .limit(1);

    if (existingOrders.length === 0) {
      console.error(`Order with reference ${reference} not found in database`);
      return NextResponse.redirect(new URL('/checkout?error=order_not_found', req.url));
    }

    const order = existingOrders[0];

    // If order is already paid, just redirect to success
    if (order.paymentStatus === 'paid') {
      return NextResponse.redirect(new URL(`/checkout/success?orderNumber=${order.orderNumber}`, req.url));
    }

    // Update the order in the database to paid and processing
    await db
      .update(orders)
      .set({
        paymentStatus: 'paid',
        status: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    // Create the default tracking shipment
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

    return NextResponse.redirect(new URL(`/checkout/success?orderNumber=${order.orderNumber}`, req.url));
  } catch (error) {
    console.error('Error verifying Paystack payment:', error);
    return NextResponse.redirect(new URL('/checkout?error=verification_error', req.url));
  }
}
