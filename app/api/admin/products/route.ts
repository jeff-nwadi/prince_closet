import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { products } from '@/lib/db/schema';
import { eq, or, ilike } from 'drizzle-orm';

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
  const search = searchParams.get('search') ?? '';
  const status = searchParams.get('status') ?? '';

  try {
    let query = db.select().from(products).$dynamic();

    if (status && status !== 'All') {
      query = query.where(eq(products.status, status));
    }

    const allProducts = await query;

    let filtered = allProducts;
    if (search) {
      const q = search.toLowerCase();
      filtered = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ products: filtered });
  } catch (err) {
    console.error('[admin/products GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, category, price, stock, emoji, status, sku, threshold, description, sizes } = body;

    // Validate inputs
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!category || typeof category !== 'string') {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!price || typeof price !== 'string') {
      return NextResponse.json({ error: 'Price is required' }, { status: 400 });
    }
    if (sku && typeof sku !== 'string') {
      return NextResponse.json({ error: 'SKU must be a string' }, { status: 400 });
    }

    const newId = String(Date.now());
    const generatedSku = sku || `PC-${category.slice(0, 3).toUpperCase()}-${newId.slice(-4)}`;

    await db.insert(products).values({
      id: newId,
      name,
      category,
      price,
      stock: Number(stock ?? 0),
      emoji: emoji || '👕',
      status: status || 'Active',
      sku: generatedSku,
      threshold: Number(threshold ?? 10),
      description: description || '',
      sizesJson: JSON.stringify(sizes || ["XS", "S", "M", "L", "XL"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, id: newId });
  } catch (err) {
    console.error('[admin/products POST] Error:', err);
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
    const { id, name, category, price, stock, emoji, status, sku, threshold, description, sizes } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const updates: Partial<any> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (price !== undefined) updates.price = price;
    if (stock !== undefined) updates.stock = Number(stock);
    if (emoji !== undefined) updates.emoji = emoji;
    if (status !== undefined) updates.status = status;
    if (sku !== undefined) updates.sku = sku;
    if (threshold !== undefined) updates.threshold = Number(threshold);
    if (description !== undefined) updates.description = description;
    if (sizes !== undefined) updates.sizesJson = JSON.stringify(sizes);

    await db.update(products).set(updates).where(eq(products.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/products PATCH] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    await db.delete(products).where(eq(products.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/products DELETE] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
