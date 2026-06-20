const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Manually parse .env file
try {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        process.env[key] = value;
      }
    });
  }
} catch (e) {
  console.error("Error parsing .env file:", e);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(connectionString);

async function main() {
  try {
    console.log("Seeding database...");

    // 1. Seed Products
    const productsToInsert = [
      { id: '1', name: 'Classic Logo Tee', category: 'Tees', price: '29500', stock: 42, emoji: '👕', status: 'Active', sku: 'PC-TEE-001', threshold: 10, description: 'A premium heavyweight organic cotton tee featuring our signature classic logo chest print.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '2', name: 'Linen Blend Shorts', category: 'Bottoms', price: '24750', stock: 0, emoji: '👖', status: 'Active', sku: 'PC-BOT-002', threshold: 10, description: 'Relaxed linen blend shorts with an elasticated waistband and adjustable drawcord.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '3', name: 'Oversized Hoodie', category: 'Hoodies', price: '38000', stock: 15, emoji: '🧥', status: 'Active', sku: 'PC-HOD-003', threshold: 10, description: 'An oversized fit hoodie made from thick loopback cotton fleece.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '4', name: 'Relaxed Cargo Trousers', category: 'Bottoms', price: '36500', stock: 8, emoji: '👖', status: 'Active', sku: 'PC-BOT-004', threshold: 10, description: 'Wide-leg cargo trousers with a relaxed silhouette.', sizesJson: JSON.stringify(["28", "30", "32", "34", "36"]) },
      { id: '5', name: 'Minimalist Cap', category: 'Headwear', price: '12000', stock: 4, emoji: '🧢', status: 'Active', sku: 'PC-CAP-005', threshold: 10, description: 'A clean, unstructured cap with a curved brim.', sizesJson: JSON.stringify(["One Size"]) },
      { id: '6', name: 'Denim Tiered Dress', category: 'New Arrival', price: '52000', stock: 20, emoji: '👗', status: 'Active', sku: 'PC-DRS-006', threshold: 10, description: 'A tiered denim dress with a flattering A-line silhouette.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '7', name: 'Signature Logo Tee', category: 'Tees', price: '29500', stock: 33, emoji: '👕', status: 'Draft', sku: 'PC-TEE-007', threshold: 10, description: 'A fresh take on our classic tee featuring a minimalist front logo and bold back graphic.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '8', name: 'Pleated Trousers', category: 'Bottoms', price: '45000', stock: 12, emoji: '👖', status: 'Active', sku: 'PC-BOT-008', threshold: 10, description: 'Elegant wide-leg trousers with front pleats and a high waist.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '9', name: 'Zip-Up Heavy Hoodie', category: 'Hoodies', price: '42000', stock: 18, emoji: '🧥', status: 'Active', sku: 'PC-HOD-009', threshold: 10, description: 'A premium heavy-weight zip-up hoodie featuring custom hardware.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) },
      { id: '10', name: 'Silk Slip Dress', category: 'New Arrival', price: '65000', stock: 11, emoji: '🥻', status: 'Active', sku: 'PC-DRS-010', threshold: 10, description: 'A luxurious 100% silk slip dress with delicate straps.', sizesJson: JSON.stringify(["XS", "S", "M", "L", "XL"]) }
    ];

    for (const p of productsToInsert) {
      await sql`
        INSERT INTO products (id, name, category, price, stock, emoji, status, sku, threshold, description, "sizesJson", "createdAt", "updatedAt")
        VALUES (${p.id}, ${p.name}, ${p.category}, ${p.price}, ${p.stock}, ${p.emoji}, ${p.status}, ${p.sku}, ${p.threshold}, ${p.description}, ${p.sizesJson}, NOW(), NOW())
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          stock = EXCLUDED.stock,
          emoji = EXCLUDED.emoji,
          status = EXCLUDED.status,
          sku = EXCLUDED.sku,
          threshold = EXCLUDED.threshold,
          description = EXCLUDED.description,
          "sizesJson" = EXCLUDED."sizesJson",
          "updatedAt" = NOW()
      `;
    }
    console.log("Products seeded successfully.");

    // 2. Seed Discounts
    const discountsToInsert = [
      { id: 'd1', code: 'WELCOME10', type: 'percentage', value: '10', status: 'Active', usageCount: 15, maxUsage: 100 },
      { id: 'd2', code: 'PRINCE50', type: 'percentage', value: '50', status: 'Active', usageCount: 5, maxUsage: 20 },
      { id: 'd3', code: 'SUMMER20', type: 'percentage', value: '20', status: 'Inactive', usageCount: 50, maxUsage: 50 },
      { id: 'd4', code: 'FREESHIP', type: 'fixed', value: '3000', status: 'Active', usageCount: 22, maxUsage: 200 }
    ];

    for (const d of discountsToInsert) {
      await sql`
        INSERT INTO discounts (id, code, type, value, status, "usageCount", "maxUsage", "createdAt")
        VALUES (${d.id}, ${d.code}, ${d.type}, ${d.value}, ${d.status}, ${d.usageCount}, ${d.maxUsage}, NOW())
        ON CONFLICT (code) DO UPDATE SET
          type = EXCLUDED.type,
          value = EXCLUDED.value,
          status = EXCLUDED.status,
          "usageCount" = EXCLUDED."usageCount",
          "maxUsage" = EXCLUDED."maxUsage"
      `;
    }
    console.log("Discounts seeded successfully.");

    // 3. Create dummy user if not exists
    const userId = 'seed-user-1';
    await sql`
      INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt")
      VALUES (${userId}, 'Nkechi Okonkwo', 'nkechi@example.com', true, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `;

    // 4. Create dummy orders if not exists
    const order1Id = 'seed-order-1';
    const order2Id = 'seed-order-2';
    
    await sql`
      INSERT INTO orders (id, "userId", "orderNumber", status, "totalAmount", "shippingName", "paymentStatus", "createdAt", "updatedAt")
      VALUES 
        (${order1Id}, ${userId}, 'ORD-8901', 'processing', '52000', 'Nkechi Okonkwo', 'paid', NOW(), NOW()),
        (${order2Id}, ${userId}, 'ORD-8874', 'processing', '38000', 'Babatunde Lawal', 'paid', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `;

    // 5. Seed Returns
    const returnsToInsert = [
      { id: 'r1', orderId: order1Id, productEmoji: '👗', productName: 'Denim Tiered Dress', orderNumber: 'ORD-8901', customerName: 'Nkechi Okonkwo', reason: 'Wrong size delivered', amount: '₦52,000', status: 'Pending' },
      { id: 'r2', orderId: order2Id, productEmoji: '🧥', productName: 'Oversized Hoodie', orderNumber: 'ORD-8874', customerName: 'Babatunde Lawal', reason: 'Item was defective upon arrival', amount: '₦38,000', status: 'Pending' }
    ];

    for (const r of returnsToInsert) {
      await sql`
        INSERT INTO returns (id, "orderId", "productEmoji", "productName", "orderNumber", "customerName", reason, amount, status, "createdAt")
        VALUES (${r.id}, ${r.orderId}, ${r.productEmoji}, ${r.productName}, ${r.orderNumber}, ${r.customerName}, ${r.reason}, ${r.amount}, ${r.status}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status
      `;
    }
    console.log("Returns seeded successfully.");

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

main();
