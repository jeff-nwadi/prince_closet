import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/db';
import { orders, user, orderItems, products } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

function isAdmin(email: string) {
  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);
  return adminEmails.includes(email.toLowerCase());
}

function toCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  const escape = (v: string | number | null | undefined) => {
    const s = String(v ?? '').replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  return [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n');
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user || !isAdmin(session.user.email))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'sales', 'inventory', 'customers'

  try {
    let csv = '';
    let filename = 'report.csv';

    if (type === 'sales') {
      const salesOrders = await db
        .select({
          orderNumber: orders.orderNumber,
          customerName: orders.shippingName,
          customerEmail: user.email,
          totalAmount: orders.totalAmount,
          paymentStatus: orders.paymentStatus,
          status: orders.status,
          shippingMethod: orders.shippingMethod,
          createdAt: orders.createdAt,
        })
        .from(orders)
        .leftJoin(user, eq(orders.userId, user.id))
        .orderBy(desc(orders.createdAt));

      csv = toCSV(
        ['Order Number', 'Customer Name', 'Customer Email', 'Amount (₦)', 'Payment Status', 'Order Status', 'Shipping Method', 'Date'],
        salesOrders.map((o) => [
          o.orderNumber,
          o.customerName,
          o.customerEmail,
          o.totalAmount,
          o.paymentStatus,
          o.status,
          o.shippingMethod,
          o.createdAt?.toISOString(),
        ])
      );
      filename = 'sales-report.csv';
    } else if (type === 'inventory') {
      const inv = await db.select().from(products);
      csv = toCSV(
        ['ID', 'SKU', 'Name', 'Category', 'Price (₦)', 'Stock', 'Threshold', 'Status'],
        inv.map((p) => [p.id, p.sku, p.name, p.category, p.price, p.stock, p.threshold, p.status])
      );
      filename = 'inventory-report.csv';
    } else if (type === 'customers') {
      const customers = await db
        .select({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt })
        .from(user)
        .orderBy(desc(user.createdAt));
      csv = toCSV(
        ['ID', 'Name', 'Email', 'Joined'],
        customers.map((c) => [c.id, c.name, c.email, c.createdAt?.toISOString()])
      );
      filename = 'customers-report.csv';
    } else {
      return NextResponse.json({ error: 'type param required: sales | inventory | customers' }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('[admin/reports GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
