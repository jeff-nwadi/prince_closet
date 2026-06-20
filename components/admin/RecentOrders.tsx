import Link from 'next/link';

const recentOrders = [
  { id: '#ORD-9012', customer: 'Chinedu Okafor', items: 3, amount: '₦145,000', status: 'Delivered' },
  { id: '#ORD-9013', customer: 'Aisha Bello', items: 1, amount: '₦42,500', status: 'Processing' },
  { id: '#ORD-9014', customer: 'Oluwaseun Adebayo', items: 4, amount: '₦210,000', status: 'In Transit' },
  { id: '#ORD-9015', customer: 'Ngozi Eze', items: 2, amount: '₦89,000', status: 'Delivered' },
  { id: '#ORD-9016', customer: 'Fatima Ibrahim', items: 1, amount: '₦35,000', status: 'Cancelled' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Delivered':
      return 'bg-green-100 text-green-700';
    case 'In Transit':
      return 'bg-amber-100 text-amber-700';
    case 'Processing':
      return 'bg-[#dfcac3] text-[#4a3129]'; // Theme accent
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm flex flex-col h-full">
      <div className="p-5 flex justify-between items-center border-b border-[#dfcac3]/30">
        <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Recent Orders</h2>
        <Link href="/admin/orders" className="text-[#8a7d72] text-xs hover:text-[#4a3129] hover:underline font-medium">
          See all
        </Link>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
              <th className="font-medium p-4 whitespace-nowrap">Order ID</th>
              <th className="font-medium p-4 whitespace-nowrap">Customer</th>
              <th className="font-medium p-4 whitespace-nowrap">Items</th>
              <th className="font-medium p-4 whitespace-nowrap">Amount</th>
              <th className="font-medium p-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody className="text-[12px] text-[#4a3129]">
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                <td className="p-4 font-bold text-[#4a3129]">{order.id}</td>
                <td className="p-4">{order.customer}</td>
                <td className="p-4">{order.items}</td>
                <td className="p-4 font-medium">{order.amount}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
