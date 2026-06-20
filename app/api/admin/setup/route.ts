import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { user, orders } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, secretKey } = body as {
      email?: string;
      password?: string;
      name?: string;
      secretKey?: string;
    };

    // Validate secret key to prevent unauthorized use
    const expectedKey = process.env.ADMIN_SETUP_KEY || process.env.BETTER_AUTH_SECRET;
    if (!secretKey || secretKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    // Check email is in ADMIN_EMAILS
    const adminEmails = (process.env.ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!adminEmails.includes(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'This email is not in the ADMIN_EMAILS list' },
        { status: 400 }
      );
    }

    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || 'Admin',
      },
    });

    return NextResponse.json({ success: true, message: `Admin account created for ${email}` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // If user already exists, Better Auth will throw
    if (message.toLowerCase().includes('already')) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }
    console.error('[admin/setup] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const allOrders = await db.select().from(orders);
    return NextResponse.json({ success: true, allOrders });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
