'use client';

import { useState } from 'react';
import { SectionCard, ProductThumb, StatusBadge } from './DashboardPrimitives';
import { ChevronRight, X, Calendar, MapPin, Truck, Phone, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardRecentOrders({ orders }: { orders: any[] }) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <>
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
                        onClick={() => setSelectedOrder(order)}
                        aria-label={`View details for order ${order.orderNumber}`}
                        className="text-gray-400 group-hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
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

      {/* Order Details Modal Overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-[#2a1f1a]/50 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#f4f0ea] border border-[#dfcac3] rounded-3xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#4a3129]/10 bg-[#e3dbcf]/50">
                <div>
                  <h3 className="heading text-[#4A3129] text-[18px] sm:text-[20px] uppercase font-bold">
                    Order Details
                  </h3>
                  <p className="text-xs text-[#4a3129]/60 mt-0.5">
                    ID: {selectedOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="h-8 w-8 rounded-full border border-[#4a3129]/15 hover:bg-[#4a3129]/10 flex items-center justify-center text-[#4a3129]/75 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto flex flex-col gap-6">
                
                {/* Meta details cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#e3dbcf]/30 border border-[#dfcac3]/30 rounded-xl p-4 flex gap-3">
                    <Calendar className="h-5 w-5 text-[#534AB7] shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#4a3129]/55 font-bold">Order Placed</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div className="bg-[#e3dbcf]/30 border border-[#dfcac3]/30 rounded-xl p-4 flex gap-3">
                    <CreditCard className="h-5 w-5 text-[#534AB7] shrink-0" />
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-[#4a3129]/55 font-bold">Payment Status</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">Paid · {selectedOrder.price}</p>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                {selectedOrder.shippingName && (
                  <div className="bg-white border border-[#dfcac3]/40 rounded-2xl p-5 flex flex-col gap-3">
                    <h4 className="text-xs uppercase tracking-widest font-bold text-[#4A3129] border-b border-[#4a3129]/5 pb-2">
                      Shipping Information
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex gap-2.5">
                        <MapPin className="h-4 w-4 text-[#534AB7] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-gray-950">{selectedOrder.shippingName}</p>
                          <p className="text-gray-500 mt-0.5">{selectedOrder.shippingAddress1}</p>
                          {selectedOrder.shippingAddress2 && <p className="text-gray-500">{selectedOrder.shippingAddress2}</p>}
                          <p className="text-gray-500">
                            {selectedOrder.shippingCity}
                            {selectedOrder.shippingState ? `, ${selectedOrder.shippingState}` : ''}
                            {selectedOrder.shippingPostalCode ? ` ${selectedOrder.shippingPostalCode}` : ''}
                          </p>
                          <p className="text-gray-500">{selectedOrder.shippingCountry}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-2.5">
                          <Phone className="h-4 w-4 text-[#534AB7] shrink-0" />
                          <div>
                            <p className="text-gray-400 text-[10px] uppercase font-bold">Contact Phone</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.shippingPhone}</p>
                          </div>
                        </div>
                        <div className="flex gap-2.5">
                          <Truck className="h-4 w-4 text-[#534AB7] shrink-0" />
                          <div>
                            <p className="text-gray-400 text-[10px] uppercase font-bold">Shipping Method</p>
                            <p className="font-semibold text-gray-900 capitalize">{selectedOrder.shippingMethod === 'express' ? 'Express Courier (€15.00)' : 'Standard Delivery (Free)'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items list */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-[#4A3129] border-b border-[#4a3129]/5 pb-2">
                    Order Items
                  </h4>
                  <div className="flex flex-col gap-3 divide-y divide-[#4a3129]/5">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 pt-3 first:pt-0">
                          <div className="relative w-12 h-16 bg-[#e3dbcf]/50 overflow-hidden shrink-0 rounded-lg">
                            <Image src={item.thumbnail} alt={item.productName} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <p className="text-sm font-semibold text-[#4a3129] truncate">{item.productName}</p>
                            <p className="text-xs text-[#4a3129]/50 uppercase tracking-widest mt-1">
                              Size: {item.size} · Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-[#4a3129] self-center shrink-0">
                            {item.price}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex gap-4 pt-3 first:pt-0">
                        <div className="relative w-12 h-16 bg-[#e3dbcf]/50 overflow-hidden shrink-0 rounded-lg">
                          <Image src={selectedOrder.thumbnail} alt={selectedOrder.product} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-sm font-semibold text-[#4a3129] truncate">{selectedOrder.product}</p>
                          <p className="text-xs text-[#4a3129]/50 uppercase tracking-widest mt-1">
                            Qty: 1
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#4a3129] self-center shrink-0">
                          {selectedOrder.price}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#4a3129]/10 bg-[#e3dbcf]/20 flex justify-between items-center text-sm font-bold text-[#4a3129]">
                <span className="uppercase tracking-wider">Total Charge</span>
                <span className="text-[18px]">{selectedOrder.price}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
