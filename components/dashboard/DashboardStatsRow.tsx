'use client';


import { Badge } from './DashboardPrimitives';
import { ShoppingBag, Truck, Heart, CreditCard } from 'lucide-react';

const icons: Record<string, any> = {
  orders: ShoppingBag,
  transit: Truck,
  wishlist: Heart,
  credit: CreditCard,
};

export default function DashboardStatsRow({ stats }: { stats: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const IconComponent = icons[stat.id] || ShoppingBag;
        return (
          <div
            key={stat.id}
            className="bg-white border border-gray-200/70 rounded-xl p-5 hover:shadow-md hover:border-purple-200/80 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-purple-50 group-hover:text-[#534AB7] transition-all duration-300">
                  <IconComponent className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-gray-900 mt-0.5">
                    {stat.value}
                  </p>
                </div>
              </div>
              {stat.badge && <Badge variant={stat.badgeColor}>{stat.badge}</Badge>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
