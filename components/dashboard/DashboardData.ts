export type OrderStatus = 'delivered' | 'in-transit' | 'returned';

export interface Order {
  id: string;
  product: string;
  orderNumber: string;
  date: string;
  price: string;
  status: OrderStatus;
  thumbnail: string; // initials fallback colour
}

export interface WishlistItem {
  id: string;
  product: string;
  price: string;
  originalPrice?: string;
  onSale: boolean;
  thumbnail: string;
}

export interface ShipmentStep {
  label: string;
  completed: boolean;
  active: boolean;
}

// ─── Customer ────────────────────────────────────────────────────────────────
export const customer = {
  name: 'Adaeze Okonkwo',
  initials: 'AO',
  location: 'Lagos, Nigeria',
  memberSince: 'March 2022',
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const stats = [
  {
    id: 'orders',
    label: 'Total Orders',
    value: '24',
    badge: '+3 this month',
    badgeColor: 'purple',
  },
  {
    id: 'transit',
    label: 'In Transit',
    value: '2',
    badge: 'Arriving soon',
    badgeColor: 'amber',
  },
  {
    id: 'wishlist',
    label: 'Wishlist',
    value: '11',
    badge: '2 on sale',
    badgeColor: 'green',
  },
  {
    id: 'credit',
    label: 'Store Credit',
    value: '₦7,500',
    badge: 'Expires Jul 31',
    badgeColor: 'red',
  },
] as const;

// ─── Orders ───────────────────────────────────────────────────────────────────
export const recentOrders: Order[] = [
  {
    id: '1',
    product: 'Floral Wrap Dress',
    orderNumber: '#PC-00841',
    date: 'Jun 5, 2025',
    price: '₦32,500',
    status: 'delivered',
    thumbnail: 'bg-purple-100',
  },
  {
    id: '2',
    product: 'Classic Blazer — Ivory',
    orderNumber: '#PC-00867',
    date: 'Jun 9, 2025',
    price: '₦58,000',
    status: 'in-transit',
    thumbnail: 'bg-amber-100',
  },
  {
    id: '3',
    product: 'Slim-Fit Trousers',
    orderNumber: '#PC-00879',
    date: 'Jun 10, 2025',
    price: '₦21,000',
    status: 'in-transit',
    thumbnail: 'bg-blue-100',
  },
  {
    id: '4',
    product: 'Canvas Tote Bag',
    orderNumber: '#PC-00792',
    date: 'May 22, 2025',
    price: '₦9,500',
    status: 'returned',
    thumbnail: 'bg-gray-100',
  },
];

// ─── Active Shipment ──────────────────────────────────────────────────────────
export const activeShipment = {
  product: 'Classic Blazer — Ivory',
  orderNumber: '#PC-00867',
  estimatedArrival: 'Jun 14, 2025',
  steps: [
    { label: 'Shipped',           completed: true,  active: false },
    { label: 'In Transit',        completed: true,  active: false },
    { label: 'Out for Delivery',  completed: false, active: true  },
    { label: 'Delivered',         completed: false, active: false },
  ] satisfies ShipmentStep[],
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const wishlistItems: WishlistItem[] = [
  {
    id: 'w1',
    product: 'Ribbed Bodysuit — Black',
    price: '₦14,500',
    onSale: false,
    thumbnail: 'bg-gray-200',
  },
  {
    id: 'w2',
    product: 'Bucket Hat — Sand',
    price: '₦6,800',
    originalPrice: '₦9,200',
    onSale: true,
    thumbnail: 'bg-yellow-100',
  },
  {
    id: 'w3',
    product: 'Air Mesh Sneakers',
    price: '₦27,000',
    originalPrice: '₦34,000',
    onSale: true,
    thumbnail: 'bg-blue-50',
  },
];
