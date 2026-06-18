'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, PackageCheck, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const mockEligibleItems = [
  {
    id: '1',
    orderNumber: 'ORD-8923-PC',
    product: 'Classic Wool Trench Coat',
    price: '€245.00',
    date: 'Oct 12, 2023',
    image: '/images/products/img_1.png',
  },
  {
    id: '2',
    orderNumber: 'ORD-8923-PC',
    product: 'Silk Blend Tailored Trousers',
    price: '€120.00',
    date: 'Oct 12, 2023',
    image: '/images/products/img_2.png',
  }
];

export default function ReturnsPage() {
  return (
    <div className="w-full min-h-screen bg-[#f4f0ea] pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-20">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#4a3129]/60 hover:text-[#4a3129] transition-colors mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading text-[#4A3129] uppercase text-[30px] md:text-[40px] mb-2">Return Center</h1>
          <p className="text-[#8a7d72] mb-10 max-w-xl">
            Not completely in love with your purchase? You have 30 days from the delivery date to return eligible items for a full refund or store credit.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#e3dbcf]/50 rounded-2xl p-6 border border-[#dfcac3]/30">
              <PackageCheck className="h-6 w-6 text-[#534AB7] mb-3" />
              <h3 className="font-bold text-[#4a3129] mb-1">Easy Returns</h3>
              <p className="text-sm text-[#4a3129]/70">Print your prepaid shipping label at home and drop it off at any authorized location.</p>
            </div>
            <div className="bg-[#e3dbcf]/50 rounded-2xl p-6 border border-[#dfcac3]/30">
              <Clock className="h-6 w-6 text-[#534AB7] mb-3" />
              <h3 className="font-bold text-[#4a3129] mb-1">Quick Processing</h3>
              <p className="text-sm text-[#4a3129]/70">Refunds are processed within 3-5 business days after we receive your returned items.</p>
            </div>
            <div className="bg-[#e3dbcf]/50 rounded-2xl p-6 border border-[#dfcac3]/30">
              <AlertCircle className="h-6 w-6 text-[#534AB7] mb-3" />
              <h3 className="font-bold text-[#4a3129] mb-1">Return Policy</h3>
              <p className="text-sm text-[#4a3129]/70">Items must be unworn, unwashed, and have original tags attached.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#dfcac3]/40 shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[#dfcac3]/30 bg-[#fbfaf8]">
              <h2 className="text-[18px] font-bold text-[#4a3129] uppercase tracking-wide">Eligible for Return</h2>
              <p className="text-sm text-[#4a3129]/60 mt-1">Select items you would like to return</p>
            </div>
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              {mockEligibleItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-[#dfcac3]/30 hover:border-[#4a3129]/20 transition-colors">
                  <div className="h-24 w-20 relative bg-[#e3dbcf] rounded-lg overflow-hidden shrink-0">
                    {/* Fallback image if product image not found */}
                    <div className="absolute inset-0 bg-gray-200" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#4a3129]">{item.product}</h3>
                      <span className="font-semibold text-[#4a3129]">{item.price}</span>
                    </div>
                    <p className="text-xs text-[#4a3129]/60 uppercase tracking-wider mb-3">Order: {item.orderNumber} • Delivered: {item.date}</p>
                    <button className="self-start text-sm bg-[#e3dbcf]/40 hover:bg-[#e3dbcf] text-[#4a3129] px-4 py-2 rounded-lg font-medium transition-colors">
                      Start Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
