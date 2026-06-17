import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db/db';
import { orders, orderItems, shipments } from '@/lib/db/schema';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, shippingAddress } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.address1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return NextResponse.json({ error: 'Invalid shipping address' }, { status: 400 });
    }

    // 1. Calculate total amount including shipping
    const shippingCost = shippingAddress.shippingMethod === 'express' ? 15.0 : 0.0;
    const subtotal = items.reduce((sum, item) => {
      const numeric = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + numeric * item.quantity;
    }, 0);
    const totalAmount = subtotal + shippingCost;
    const totalAmountStr = `€${totalAmount.toFixed(2)}`;

    // 2. Generate unique order number and reference
    const orderNumber = `PC-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrderId = crypto.randomUUID();

    // Verify Paystack Configuration
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY is missing from environment variables');
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    // 3. Perform database inserts
    await db.insert(orders).values({
      id: newOrderId,
      userId: session.user.id,
      orderNumber,
      status: 'pending',
      totalAmount: totalAmountStr,
      shippingName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      shippingAddress1: shippingAddress.address1,
      shippingAddress2: shippingAddress.address2 || '',
      shippingCity: shippingAddress.city,
      shippingState: shippingAddress.state || '',
      shippingPostalCode: shippingAddress.postalCode,
      shippingCountry: shippingAddress.country,
      shippingPhone: shippingAddress.phone,
      shippingMethod: shippingAddress.shippingMethod,
      paymentStatus: 'pending',
      paymentReference: orderNumber,
    });

    for (const item of items) {
      await db.insert(orderItems).values({
        id: crypto.randomUUID(),
        orderId: newOrderId,
        productId: String(item.id),
        productName: item.title,
        price: item.price,
        quantity: String(item.quantity),
        size: item.size || 'M',
      });
    }

    // 4. Initialize Paystack Transaction
    const currency = process.env.PAYSTACK_CURRENCY || 'NGN';

    // Convert EUR display price to the Paystack settlement currency.
    // For production, replace with a live FX rate lookup.
    const EUR_TO_NGN_RATE = parseFloat(process.env.EUR_TO_NGN_RATE || '1700');
    const paystackAmount =
      currency === 'NGN' ? totalAmount * EUR_TO_NGN_RATE : totalAmount;
    const amountInSubunits = Math.round(paystackAmount * 100);

    const baseUrl = req.nextUrl.origin;
    const callbackUrl = `${baseUrl}/api/checkout/verify`;

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: session.user.email,
        amount: amountInSubunits,
        currency,
        reference: orderNumber,
        callback_url: callbackUrl,
        metadata: {
          orderId: newOrderId,
          originalAmountEUR: totalAmount,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      console.error('Paystack API Error:', paystackData);
      throw new Error(paystackData.message || 'Payment initialization failed');
    }

    return NextResponse.json({
      success: true,
      url: paystackData.data.authorization_url,
      orderNumber,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
