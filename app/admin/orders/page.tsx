'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: string;
  createdAt: string;
  shippingName: string | null;
  shippingCity: string | null;
  customerEmail: string | null;
  itemCount: number;
};

const statusOptions = ['All', 'Processing', 'In Transit', 'Delivered', 'Cancelled'];
const statusMap: Record<string, string> = {
  'Processing': 'processing',
  'In Transit': 'in-transit',
  'Delivered': 'delivered',
  'Cancelled': 'cancelled',
};
const reverseStatusMap: Record<string, string> = Object.fromEntries(
  Object.entries(statusMap).map(([k, v]) => [v, k])
);

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'in-transit': return 'bg-amber-100 text-amber-700';
    case 'processing': return 'bg-[#dfcac3] text-[#4a3129]';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'All') params.set('status', statusMap[statusFilter]);
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(data.orders ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newDisplayStatus: string) => {
    const newStatus = statusMap[newDisplayStatus] ?? newDisplayStatus;
    setUpdating(orderId);
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      {/* Filters Bar */}
      <div className="bg-white border border-[#dfcac3]/50 rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7d72]" />
          <input
            type="text"
            placeholder="Search orders or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#f4f0ea] border border-[#dfcac3]/50 text-[#4a3129] placeholder:text-[#8a7d72] outline-none focus:border-[#4a3129] transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-[#8a7d72]" />
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-[#4a3129] text-white'
                  : 'bg-[#f4f0ea] text-[#8a7d72] hover:bg-[#dfcac3]/50 hover:text-[#4a3129]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">All Orders</h2>
          {loading
            ? <Loader2 size={14} className="text-[#8a7d72] animate-spin" />
            : <span className="text-[10px] text-[#8a7d72] font-medium">{orders.length} results</span>
          }
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 size={24} className="text-[#dfcac3] animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                  <th className="font-medium p-4">Order</th>
                  <th className="font-medium p-4">Customer</th>
                  <th className="font-medium p-4">Date</th>
                  <th className="font-medium p-4">Items</th>
                  <th className="font-medium p-4">Amount</th>
                  <th className="font-medium p-4">Payment</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Update</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                    <td className="p-4 font-bold">{order.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-medium">{order.shippingName ?? 'N/A'}</p>
                      <p className="text-[10px] text-[#8a7d72]">{order.customerEmail}</p>
                    </td>
                    <td className="p-4 text-[#8a7d72] whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">{order.itemCount}</td>
                    <td className="p-4 font-medium">₦{Number(order.totalAmount).toLocaleString('en-NG')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{order.paymentStatus}</span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {reverseStatusMap[order.status] ?? order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="relative flex items-center">
                        {updating === order.id ? (
                          <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
                        ) : (
                          <>
                            <select
                              value={reverseStatusMap[order.status] ?? order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="appearance-none pl-3 pr-7 py-1.5 text-[10px] bg-[#f4f0ea] border border-[#dfcac3]/50 text-[#4a3129] outline-none focus:border-[#4a3129] cursor-pointer"
                              aria-label={`Update status for ${order.orderNumber}`}
                            >
                              {statusOptions.filter(s => s !== 'All').map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 pointer-events-none text-[#8a7d72]" />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && orders.length === 0 && (
            <div className="p-12 text-center text-[#8a7d72] text-sm">No orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
