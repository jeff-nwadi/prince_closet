'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Package, MapPin, ChevronDown } from 'lucide-react';

type ShipmentRow = {
  shipmentId: string | null;
  shipmentStatus: string | null;
  estimatedArrival: string | null;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  shippingName: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingCountry: string | null;
  shippingAddress1: string | null;
  shippingMethod: string | null;
  totalAmount: string;
  createdAt: string;
  customerEmail: string | null;
};

const statusOptions = ['pending', 'shipped', 'out-for-delivery', 'delivered', 'returned'];

const statusBadge: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  shipped: 'bg-[#dfcac3] text-[#4a3129]',
  'out-for-delivery': 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-700',
};

const orderStatusBadge: Record<string, string> = {
  processing: 'bg-[#dfcac3] text-[#4a3129]',
  'in-transit': 'bg-amber-100 text-amber-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-red-100 text-red-700',
};

export default function ShippingPage() {
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/shipping');
      const data = await res.json();
      setShipments(data.shipments ?? []);
    } catch { setShipments([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  const handleStatusChange = async (shipmentId: string, newStatus: string) => {
    setUpdating(shipmentId);
    try {
      await fetch('/api/admin/shipping', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shipmentId, status: newStatus }),
      });
      setShipments((prev) =>
        prev.map((s) => s.shipmentId === shipmentId ? { ...s, shipmentStatus: newStatus } : s)
      );
    } finally { setUpdating(null); }
  };

  const inTransit = shipments.filter((s) => s.shipmentStatus === 'shipped' || s.shipmentStatus === 'out-for-delivery').length;
  const delivered = shipments.filter((s) => s.shipmentStatus === 'delivered').length;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Shipments', value: shipments.length, color: 'text-[#4a3129]' },
          { label: 'In Transit', value: inTransit, color: 'text-amber-600' },
          { label: 'Delivered', value: delivered, color: 'text-green-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-[#dfcac3]/50 rounded-lg p-5 shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-[#8a7d72] font-medium mb-2">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-[#dfcac3]/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#dfcac3]/30 flex justify-between items-center">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-wider">Shipments</h2>
          {loading
            ? <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
            : <span className="text-[10px] text-[#8a7d72]">{shipments.length} records</span>
          }
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader2 size={24} className="animate-spin text-[#dfcac3]" /></div>
          ) : shipments.length === 0 ? (
            <div className="p-12 text-center">
              <Package size={32} className="text-[#dfcac3] mx-auto mb-3" />
              <p className="text-sm text-[#8a7d72]">No shipments yet.</p>
              <p className="text-xs text-[#8a7d72]/70 mt-1">Shipments appear here once orders are processed and assigned a tracking record.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#dfcac3]/30 text-[10px] uppercase tracking-widest text-[#8a7d72]">
                  <th className="font-medium p-4">Order</th>
                  <th className="font-medium p-4">Customer</th>
                  <th className="font-medium p-4">Destination</th>
                  <th className="font-medium p-4">Method</th>
                  <th className="font-medium p-4">Amount</th>
                  <th className="font-medium p-4">Order Status</th>
                  <th className="font-medium p-4">Shipment Status</th>
                  <th className="font-medium p-4">Update</th>
                </tr>
              </thead>
              <tbody className="text-xs text-[#4a3129]">
                {shipments.map((s) => (
                  <tr key={s.shipmentId ?? s.orderId} className="border-b border-[#dfcac3]/20 last:border-0 hover:bg-[#f4f0ea]/30 transition-colors">
                    <td className="p-4 font-bold">{s.orderNumber}</td>
                    <td className="p-4">
                      <p className="font-medium">{s.shippingName ?? 'N/A'}</p>
                      <p className="text-[10px] text-[#8a7d72]">{s.customerEmail}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-start gap-1.5">
                        <MapPin size={12} className="text-[#8a7d72] mt-0.5 flex-shrink-0" />
                        <span className="text-[#8a7d72]">{[s.shippingCity, s.shippingState, s.shippingCountry].filter(Boolean).join(', ') || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[#8a7d72] capitalize">{s.shippingMethod ?? 'Standard'}</td>
                    <td className="p-4 font-medium">₦{Number(s.totalAmount).toLocaleString('en-NG')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${orderStatusBadge[s.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {s.orderStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {s.shipmentStatus ? (
                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${statusBadge[s.shipmentStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                          {s.shipmentStatus}
                        </span>
                      ) : <span className="text-[10px] text-[#8a7d72]">No shipment</span>}
                    </td>
                    <td className="p-4">
                      {s.shipmentId ? (
                        updating === s.shipmentId ? (
                          <Loader2 size={14} className="animate-spin text-[#8a7d72]" />
                        ) : (
                          <div className="relative flex items-center">
                            <select
                              value={s.shipmentStatus ?? 'pending'}
                              onChange={(e) => s.shipmentId && handleStatusChange(s.shipmentId, e.target.value)}
                              className="appearance-none pl-3 pr-7 py-1.5 text-[10px] bg-[#f4f0ea] border border-[#dfcac3]/50 text-[#4a3129] outline-none focus:border-[#4a3129] cursor-pointer"
                            >
                              {statusOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                            </select>
                            <ChevronDown size={10} className="absolute right-2 pointer-events-none text-[#8a7d72]" />
                          </div>
                        )
                      ) : (
                        <span className="text-[10px] text-[#8a7d72]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
