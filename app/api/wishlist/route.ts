import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { db } from '@/lib/db/db';
import { wishlist } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/wishlist - Get wishlist items or check specific product status
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (productId) {
      // Check if a specific product is in the wishlist
      const existing = await db.select()
        .from(wishlist)
        .where(
          and(
            eq(wishlist.userId, session.user.id),
            eq(wishlist.productId, String(productId))
          )
        )
        .limit(1);

      return NextResponse.json({ inWishlist: existing.length > 0 });
    }

    // Get all wishlist items for user
    const list = await db.select()
      .from(wishlist)
      .where(eq(wishlist.userId, session.user.id));

    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/wishlist - Add product to wishlist
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    // Check if already in wishlist to avoid duplicates
    const existing = await db.select()
      .from(wishlist)
      .where(
        and(
          eq(wishlist.userId, session.user.id),
          eq(wishlist.productId, String(productId))
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'Already wishlisted' });
    }

    await db.insert(wishlist).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      productId: String(productId),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/wishlist - Remove product from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Missing productId' }, { status: 400 });
    }

    await db.delete(wishlist).where(
      and(
        eq(wishlist.userId, session.user.id),
        eq(wishlist.productId, String(productId))
      )
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Wishlist DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
