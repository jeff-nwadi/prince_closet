import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { discounts } from '@/lib/db/schema';
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
    const list = await db.select().from(discounts).orderBy(desc(discounts.createdAt));
    return NextResponse.json({ discounts: list });
  } catch (err) {
    console.error('[admin/discounts GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const { code, type, value, status, maxUsage, expiresAt } = body as {
      code?: string; type?: string; value?: string;
      status?: string; maxUsage?: number; expiresAt?: string;
    };

    if (!code || typeof code !== 'string' || !code.trim())
      return NextResponse.json({ error: 'Discount code is required' }, { status: 400 });
    if (!type || !['percentage', 'fixed'].includes(type))
      return NextResponse.json({ error: 'Type must be percentage or fixed' }, { status: 400 });
    if (!value || isNaN(Number(value)))
      return NextResponse.json({ error: 'Valid value is required' }, { status: 400 });

    const id = `disc_${Date.now()}`;
    await db.insert(discounts).values({
      id,
      code: code.trim().toUpperCase(),
      type,
      value,
      status: status || 'Active',
      usageCount: 0,
      maxUsage: maxUsage ?? null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('unique')) return NextResponse.json({ error: 'Discount code already exists' }, { status: 409 });
    console.error('[admin/discounts POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const body = await request.json();
    const { id, status, value, maxUsage, expiresAt } = body as {
      id?: string; status?: string; value?: string; maxUsage?: number; expiresAt?: string;
    };

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const updates: Partial<typeof discounts.$inferInsert> = {};
    if (status !== undefined) updates.status = status;
    if (value !== undefined) updates.value = value;
    if (maxUsage !== undefined) updates.maxUsage = maxUsage;
    if (expiresAt !== undefined) updates.expiresAt = expiresAt ? new Date(expiresAt) : null;

    await db.update(discounts).set(updates).where(eq(discounts.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/discounts PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  try {
    await db.delete(discounts).where(eq(discounts.id, id));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/discounts DELETE]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
