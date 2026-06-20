import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    const items = await db
      .select({
        id: products.id,
        emoji: products.emoji,
        name: products.name,
        sku: products.sku,
        category: products.category,
        stock: products.stock,
        threshold: products.threshold,
      })
      .from(products);

    return NextResponse.json({ inventory: items });
  } catch (err) {
    console.error('[admin/inventory GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { productId, restockAmount, threshold } = body as {
      productId?: string;
      restockAmount?: number;
      threshold?: number;
    };

    if (!productId) {
      return NextResponse.json({ error: 'productId is required' }, { status: 400 });
    }

    const currentProduct = await db
      .select({ stock: products.stock })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (currentProduct.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updates: Partial<any> = {
      updatedAt: new Date(),
    };

    if (restockAmount !== undefined) {
      updates.stock = currentProduct[0].stock + restockAmount;
    }

    if (threshold !== undefined) {
      updates.threshold = threshold;
    }

    await db.update(products).set(updates).where(eq(products.id, productId));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/inventory PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
