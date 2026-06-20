import { db } from './db';
import { products as dbProductsSchema } from './schema';
import { products as mockProducts } from '../products';
import { eq } from 'drizzle-orm';

export interface ProductMapped {
  id: string;
  title: string;
  price: string;
  category: string;
  link: string;
  description: string;
  sizes: string[];
  image: string;
  hoverImage: string;
  image2: string;
  stock: number;
  emoji: string;
  status: string;
  sku: string;
}

function getCategoryEmoji(category: string): string {
  switch (category?.toLowerCase()) {
    case 'tees':
      return '👕';
    case 'hoodies':
      return '🧥';
    case 'bottoms-wears':
      return '🩳';
    case 'headwear':
      return '🧢';
    default:
      return '🛍️';
  }
}

export function mapDbProduct(p: any): ProductMapped {
  // Ensure the price is displayed with the Euro currency symbol for consistency in the storefront
  const rawPrice = p.price || "0";
  const displayPrice = rawPrice.startsWith('€') || rawPrice.startsWith('₦')
    ? rawPrice
    : `€${rawPrice}`;

  let parsedSizes: string[] = ["XS", "S", "M", "L", "XL"];
  if (p.sizesJson) {
    try {
      parsedSizes = JSON.parse(p.sizesJson);
    } catch {
      parsedSizes = ["XS", "S", "M", "L", "XL"];
    }
  }

  // Fallback to placeholders if images are not set (e.g., when created via the basic admin panel)
  const image = p.image || "/images/tees.png";
  const hoverImage = p.hoverImage || p.image || "/images/img_1.png";

  return {
    id: String(p.id),
    title: p.name,
    price: displayPrice,
    category: p.category,
    link: `/shop/${p.id}`,
    description: p.description || "",
    sizes: parsedSizes,
    image,
    hoverImage,
    image2: hoverImage,
    stock: p.stock ?? 0,
    emoji: p.emoji || '👕',
    status: p.status || 'Active',
    sku: p.sku || `PC-${p.id}`,
  };
}

export async function getDbProducts(): Promise<ProductMapped[]> {
  try {
    let list = await db.select().from(dbProductsSchema);
    
    if (list.length === 0) {
      console.log("Database products table is empty. Auto-seeding with mock products...");
      for (const mock of mockProducts) {
        const generatedSku = `PC-${mock.category.slice(0, 3).toUpperCase()}-${String(mock.id).padStart(4, '0')}`;
        await db.insert(dbProductsSchema).values({
          id: String(mock.id),
          name: mock.title,
          category: mock.category,
          price: mock.price.replace('€', ''), // Store raw price as numeric string
          stock: 50,
          emoji: getCategoryEmoji(mock.category),
          status: 'Active',
          sku: generatedSku,
          threshold: 10,
          image: mock.image,
          hoverImage: mock.hoverImage,
          description: mock.description,
          sizesJson: JSON.stringify(mock.sizes),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      // Re-fetch
      list = await db.select().from(dbProductsSchema);
    }

    return list.map(mapDbProduct);
  } catch (err) {
    console.error("Error fetching or seeding database products:", err);
    // Fallback to mock products if database is completely unavailable
    return mockProducts.map((p) => ({
      ...p,
      id: String(p.id),
      title: p.title,
      image2: p.image2 || p.hoverImage,
      stock: 50,
      emoji: getCategoryEmoji(p.category),
      status: 'Active',
      sku: `PC-${p.id}`,
    }));
  }
}

export async function getDbProductById(id: string): Promise<ProductMapped | null> {
  try {
    // If table is empty, calling getDbProducts will trigger auto-seeding
    const list = await db.select().from(dbProductsSchema).where(eq(dbProductsSchema.id, id)).limit(1);
    
    if (list.length === 0) {
      // In case seeding hasn't run yet, let's call getDbProducts first
      const all = await getDbProducts();
      const found = all.find(p => p.id === id);
      return found || null;
    }
    
    return mapDbProduct(list[0]);
  } catch (err) {
    console.error(`Error fetching product by ID ${id}:`, err);
    const allMock = mockProducts.map((p) => ({
      ...p,
      id: String(p.id),
      title: p.title,
      image2: p.image2 || p.hoverImage,
      stock: 50,
      emoji: getCategoryEmoji(p.category),
      status: 'Active',
      sku: `PC-${p.id}`,
    }));
    return allMock.find(p => p.id === id) || null;
  }
}
