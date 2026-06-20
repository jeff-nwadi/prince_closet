import DashboardClient from './DashboardClient';
import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db/db';
import { orders, orderItems, wishlist, shipments } from '@/lib/db/schema';
import { eq, desc, inArray, and } from 'drizzle-orm';
import { getDbProducts } from '@/lib/db/helper';

export const metadata: Metadata = {
  title: 'Customer Dashboard | Prince Closet',
  description: 'Manage your orders, shipment status, wishlist items, and store credentials.',
};

export default async function DashboardPage() {
  const products = await getDbProducts();
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  // 1. Fetch Orders
  const userOrders = await db.select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(5);

  const orderIds = userOrders.map(o => o.id);
  
  let userOrderItems: any[] = [];
  if (orderIds.length > 0) {
    userOrderItems = await db.select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, orderIds));
  }

  const mappedOrders = userOrders.map(order => {
    const itemsInOrder = userOrderItems.filter(i => i.orderId === order.id);
    const mappedItems = itemsInOrder.map(item => {
      const productDef = products.find(p => p.id.toString() === item.productId);
      return {
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        size: item.size || 'M',
        thumbnail: productDef ? productDef.image : 'bg-gray-100',
      };
    });

    const primaryItem = mappedItems[0] || null;
    
    return {
      id: order.id,
      product: primaryItem ? primaryItem.productName : 'Unknown Product',
      orderNumber: order.orderNumber,
      date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(order.createdAt)),
      price: order.totalAmount,
      status: order.status as any,
      thumbnail: primaryItem ? primaryItem.thumbnail : 'bg-gray-100',
      shippingName: order.shippingName || '',
      shippingAddress1: order.shippingAddress1 || '',
      shippingAddress2: order.shippingAddress2 || '',
      shippingCity: order.shippingCity || '',
      shippingState: order.shippingState || '',
      shippingPostalCode: order.shippingPostalCode || '',
      shippingCountry: order.shippingCountry || '',
      shippingPhone: order.shippingPhone || '',
      shippingMethod: order.shippingMethod || '',
      items: mappedItems,
    }
  });

  // 2. Fetch Wishlist
  const userWishlist = await db.select()
    .from(wishlist)
    .where(eq(wishlist.userId, user.id))
    .orderBy(desc(wishlist.createdAt));

  const mappedWishlist = userWishlist.map(w => {
    const productDef = products.find(p => p.id.toString() === w.productId);
    return {
      id: w.id,
      productId: w.productId,
      product: productDef ? productDef.title : 'Unknown Product',
      price: productDef ? productDef.price : '€0',
      onSale: false,
      thumbnail: productDef ? productDef.image : 'bg-gray-200',
      sizes: productDef ? productDef.sizes : [],
      link: productDef ? productDef.link : '/shop',
    }
  });

  // 3. Fetch Shipment
  let activeShipmentData = null;
  if (orderIds.length > 0) {
    const recentShipments = await db.select()
      .from(shipments)
      .where(inArray(shipments.orderId, orderIds));
    
    const active = recentShipments.find(s => s.status !== 'Delivered') || recentShipments[0];
    
    if (active) {
      const order = userOrders.find(o => o.id === active.orderId);
      const item = userOrderItems.find(i => i.orderId === active.orderId);
      const productDef = item ? products.find(p => p.id.toString() === item.productId) : null;
      let steps = [];
      if (active.stepsJson) {
         try {
           steps = JSON.parse(active.stepsJson);
         } catch(e) {}
      } else {
         const statusLabels = ['Shipped', 'In Transit', 'Out for Delivery', 'Delivered'];
         const currentIndex = statusLabels.indexOf(active.status) !== -1 ? statusLabels.indexOf(active.status) : 1;
         steps = statusLabels.map((label, idx) => ({
           label,
           completed: idx < currentIndex,
           active: idx === currentIndex
         }));
      }

      activeShipmentData = {
        product: productDef ? productDef.title : (item ? item.productName : 'Unknown Product'),
        orderNumber: order ? order.orderNumber : '',
        estimatedArrival: active.estimatedArrival ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(active.estimatedArrival)) : 'TBD',
        steps: steps,
      }
    }
  }

  // 4. Stats calculation
  // Total orders
  const allOrders = await db.select({ id: orders.id, status: orders.status }).from(orders).where(eq(orders.userId, user.id));
  const totalOrdersCount = allOrders.length;
  const inTransitCount = allOrders.filter(o => o.status === 'in-transit').length;

  const statsData = [
    {
      id: 'orders',
      label: 'Total Orders',
      value: totalOrdersCount.toString(),
      badge: '',
      badgeColor: 'purple' as const,
    },
    {
      id: 'transit',
      label: 'In Transit',
      value: inTransitCount.toString(),
      badge: inTransitCount > 0 ? 'Arriving soon' : '',
      badgeColor: 'amber' as const,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      value: mappedWishlist.length.toString(),
      badge: '',
      badgeColor: 'green' as const,
    },
    {
      id: 'credit',
      label: 'Store Credit',
      value: '₦0',
      badge: '',
      badgeColor: 'gray' as const,
    },
  ];

  return <DashboardClient user={user} orders={mappedOrders} wishlist={mappedWishlist} shipment={activeShipmentData} stats={statsData} />;
}
