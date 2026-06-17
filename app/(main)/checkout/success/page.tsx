'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'PC-XXXXXX';
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-[#f4f0ea] flex flex-col items-center justify-center pt-28 pb-20 px-6 sm:px-12 md:px-16 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-[#e3dbcf]/40 border border-[#dfcac3]/40 p-8 md:p-10 rounded-3xl flex flex-col items-center gap-6"
      >
        <div className="h-16 w-16 bg-[#534AB7]/10 rounded-full flex items-center justify-center text-[#534AB7]">
          <CheckCircle2 size={36} strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="heading text-[#4A3129] uppercase text-[24px] md:text-[30px] leading-tight">
            Order Confirmed
          </h1>
          <p className="text-[14px] text-[#4a3129]/60 mt-2">
            Thank you for shopping with us! Your premium sustainable pieces are now being processed.
          </p>
        </div>

        <div className="w-full bg-[#e3dbcf] p-4 flex flex-col gap-2 rounded-xl text-left border border-[#dfcac3]/30 text-sm">
          <div className="flex justify-between text-[#4a3129]">
            <span className="opacity-60">Order Number</span>
            <span className="font-semibold">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-[#4a3129]">
            <span className="opacity-60">Estimated Delivery</span>
            <span className="font-semibold">3–5 Business Days</span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3.5">
          <Link
            href="/dashboard"
            className="w-full bg-[#4A3129] text-white uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#3a2520] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <LayoutDashboard size={15} />
            Track in Dashboard
          </Link>
          <Link
            href="/shop"
            className="w-full border border-[#4a3129]/25 text-[#4a3129] uppercase text-sm font-normal py-4 tracking-widest hover:border-[#4a3129] hover:bg-[#e3dbcf] transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={15} />
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#4A3129] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
