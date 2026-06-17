'use client';

import { SectionCard, ProductThumb, StatusBadge } from './DashboardPrimitives';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardRecentOrders({ orders }: { orders: any[] }) {
  return (
    <SectionCard
      title="Recent Orders"
      action={
        <Link
          href="/shop"
          className="text-xs font-medium text-[#534AB7] hover:underline"
        >
          View all orders
        </Link>
      }
      className="h-full"
    >
      <div className="overflow-x-auto -mx-5">
        <div className="inline-block min-w-full align-middle px-5">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                <th scope="col" className="pb-3 font-medium">Product</th>
                <th scope="col" className="pb-3 font-medium hidden sm:table-cell">Order Details</th>
                <th scope="col" className="pb-3 font-medium">Price</th>
                <th scope="col" className="pb-3 font-medium">Status</th>
                <th scope="col" className="pb-3 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr
                  key={order.id}
                  className="group hover:bg-gray-50/50 transition-colors duration-150"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      {order.thumbnail.startsWith('/') ? (
                        <div className="h-12 w-12 rounded-lg flex-shrink-0 relative overflow-hidden bg-gray-100">
                          <Image src={order.thumbnail} alt={order.product} fill className="object-cover" />
                        </div>
                      ) : (
                        <ProductThumb colorClass={order.thumbnail} />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] sm:max-w-xs">
                          {order.product}
                        </p>
                        <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                          {order.orderNumber} · {order.date}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <p className="text-sm text-gray-700 font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-semibold text-gray-950">
                      {order.price}
                    </span>
                  </td>
                  <td className="py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-4 text-right">
                    <button
                      aria-label={`View details for order ${order.orderNumber}`}
                      className="text-gray-400 group-hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors duration-150"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
}
