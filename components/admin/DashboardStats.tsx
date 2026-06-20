import { TrendingUp, Package, Users, AlertCircle } from 'lucide-react';

type Stats = {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  lowStockCount: number;
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export default function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatNaira(stats.totalRevenue),
      badge: 'Paid orders',
      badgeColor: 'text-green-700 bg-green-100',
      icon: TrendingUp,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      badge: `${stats.pendingOrders} processing`,
      badgeColor: 'text-amber-700 bg-amber-100',
      icon: Package,
    },
    {
      title: 'Customers',
      value: stats.totalCustomers.toLocaleString(),
      badge: 'Registered users',
      badgeColor: 'text-[#4a3129] bg-[#dfcac3]',
      icon: Users,
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount.toString(),
      badge: stats.lowStockCount > 0 ? 'Needs restocking' : 'All good',
      badgeColor: stats.lowStockCount > 0 ? 'text-red-700 bg-red-100' : 'text-green-700 bg-green-100',
      icon: AlertCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="bg-white rounded-lg p-5 border border-[#dfcac3]/50 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-[#8a7d72] text-xs font-medium uppercase tracking-wider">{stat.title}</h3>
              <div className="p-2 bg-[#f4f0ea]">
                <Icon size={16} className="text-[#4a3129]" />
              </div>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#4a3129]">{stat.value}</span>
            </div>
            <div className="mt-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
