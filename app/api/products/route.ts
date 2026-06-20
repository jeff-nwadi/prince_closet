import { NextRequest, NextResponse } from 'next/server';
import { getDbProducts } from '@/lib/db/helper';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') ?? '';
    const query = searchParams.get('q') ?? '';

    let products = await getDbProducts();

    // Filter by Active status for public storefront
    products = products.filter(p => p.status === 'Active');

    // Filter by category
    if (category && category !== 'all') {
      const cat = category.toLowerCase();
      products = products.filter(p => p.category.toLowerCase() === cat);
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase();
      products = products.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Return the results
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('[API/products GET] Error:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
