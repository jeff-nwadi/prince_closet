import Link from 'next/link';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  createdAt: Date;
  shippingName: string | null;
  customerEmail: string | null;
  itemCount: number;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'in-transit': return 'bg-amber-100 text-amber-700';
    case 'processing': return 'bg-[#dfcac3] text-[#4a3129]';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatStatus = (s: string) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm flex flex-col h-full">
      <div className="p-5 flex justify-between items-center border-b border-[#dfcac3]/30">
        <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Recent Orders</h2>
        <Link href="/admin/orders" className="text-[#8a7d72] text-xs hover:text-[#4a3129] hover:underline font-medium">
          See all
        </Link>
      </div>
      <div className="flex-1 overflow-x-auto">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-[#8a7d72] text-sm">No orders yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                <th className="font-medium p-4 whitespace-nowrap">Order</th>
                <th className="font-medium p-4 whitespace-nowrap">Customer</th>
                <th className="font-medium p-4 whitespace-nowrap">Items</th>
                <th className="font-medium p-4 whitespace-nowrap">Amount</th>
                <th className="font-medium p-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="text-[12px] text-[#4a3129]">
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                  <td className="p-4 font-bold">{order.orderNumber}</td>
                  <td className="p-4">
                    <p className="font-medium">{order.shippingName ?? 'Unknown'}</p>
                    <p className="text-[10px] text-[#8a7d72]">{order.customerEmail}</p>
                  </td>
                  <td className="p-4">{order.itemCount}</td>
                  <td className="p-4 font-medium">₦{Number(order.totalAmount).toLocaleString('en-NG')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
