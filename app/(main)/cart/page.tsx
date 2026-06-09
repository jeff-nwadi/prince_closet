'use client';

import { useCart } from '@/lib/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-[#f4f0ea] pt-28 pb-24 px-6 sm:px-12 md:px-16">

      {/* Header */}
      <div className="mb-10 border-b border-[#4a3129]/15 pb-6 flex items-end justify-between">
        <div>
          <h1 className="heading text-[#4A3129] uppercase text-[28px] md:text-[40px] leading-tight">
            Your Bag
          </h1>
          <p className="text-[14px] font-normal text-[#4a3129]/60 mt-1">
            {isEmpty ? 'Your bag is empty.' : `${items.reduce((s, i) => s + i.quantity, 0)} item${items.reduce((s, i) => s + i.quantity, 0) === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link
          href="/shop"
          className="text-[#4a3129] uppercase text-sm font-normal hover:opacity-60 transition-opacity"
        >
          ← Continue Shopping
        </Link>
      </div>

      {isEmpty ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center py-32 gap-6 text-center"
        >
          <svg width="60" height="60" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-20">
            <path d="M1.66602 1.66667H2.75449C2.9595 1.66667 3.06201 1.66667 3.1445 1.70437C3.2172 1.73759 3.2788 1.79102 3.32197 1.85829C3.37096 1.93462 3.38546 2.0361 3.41445 2.23905L3.80887 5M3.80887 5L4.68545 11.4428C4.79669 12.2604 4.85231 12.6692 5.04777 12.977C5.22 13.2481 5.46692 13.4637 5.75881 13.5978C6.09007 13.75 6.50264 13.75 7.32777 13.75H14.4593C15.2448 13.75 15.6375 13.75 15.9585 13.6087C16.2415 13.4841 16.4842 13.2832 16.6596 13.0285C16.8585 12.7397 16.9319 12.3539 17.0789 11.5823L18.1819 5.79141C18.2337 5.51984 18.2595 5.38405 18.222 5.27792C18.1892 5.18481 18.1243 5.1064 18.039 5.05668C17.9417 5 17.8035 5 17.527 5H3.80887ZM8.33268 17.5C8.33268 17.9602 7.95959 18.3333 7.49935 18.3333C7.03911 18.3333 6.66602 17.9602 6.66602 17.5C6.66602 17.0398 7.03911 16.6667 7.49935 16.6667C7.95959 16.6667 8.33268 17.0398 8.33268 17.5ZM14.9993 17.5C14.9993 17.9602 14.6263 18.3333 14.166 18.3333C13.7058 18.3333 13.3327 17.9602 13.3327 17.5C13.3327 17.0398 13.7058 16.6667 14.166 16.6667C14.6263 16.6667 14.9993 17.0398 14.9993 17.5Z" stroke="#4D3D30" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="heading text-[#4a3129] text-[22px] md:text-[28px] uppercase">Nothing here yet</p>
          <p className="text-[14px] text-[#4a3129]/60 max-w-xs">
            Looks like you haven't added anything to your bag. Browse the collection and find something you love.
          </p>
          <Link
            href="/shop"
            className="mt-4 bg-[#4A3129] text-white uppercase text-sm font-normal px-8 py-4 tracking-widest hover:bg-[#4a3129]/80 transition-all duration-300"
          >
            Shop Now
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">

          {/* Cart items — left col (spans 2) */}
          <div className="lg:col-span-2 flex flex-col gap-0">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="flex gap-5 py-6 border-b border-[#4a3129]/10"
                >
                  {/* Image */}
                  <Link href={item.link} className="shrink-0 block group">
                    <div className="relative w-[100px] h-[130px] sm:w-[120px] sm:h-[155px] overflow-hidden bg-[#e3dbcf]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>

                  {/* Details */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <Link href={item.link}>
                          <h3 className="text-[#4A3129] uppercase text-[14px] sm:text-[15px] font-normal tracking-wide hover:opacity-70 transition-opacity">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-[12px] text-[#4a3129]/50 uppercase tracking-widest mt-1">
                          Size: {item.size}
                        </p>
                      </div>
                      <p className="text-[14px] font-normal text-[#4a3129] shrink-0">{item.price}</p>
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#4A3129]/40">
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity - 1)}
                          className="px-3 py-2 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-base leading-none"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-sm text-[#4a3129] border-x border-[#4a3129]/20 min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.size, item.quantity + 1)}
                          className="px-3 py-2 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-base leading-none"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="flex items-center gap-1.5 text-[12px] text-[#4a3129]/50 uppercase tracking-widest hover:text-[#4a3129] transition-colors duration-200"
                      >
                        <Trash2 size={13} />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="mt-4 self-start text-[12px] text-[#4a3129]/40 uppercase tracking-widest hover:text-[#4a3129] transition-colors duration-200"
            >
              Clear Bag
            </button>
          </div>

          {/* Order summary — right col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-1"
          >
            <div className="bg-[#e3dbcf] p-6 flex flex-col gap-5 sticky top-28">
              <h2 className="heading text-[#4A3129] uppercase text-[18px] md:text-[22px]">
                Order Summary
              </h2>

              <div className="flex flex-col gap-3 text-[14px] text-[#4a3129]">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex justify-between">
                    <span className="truncate mr-2 text-[#4a3129]/70">
                      {item.title} × {item.quantity}
                      <span className="text-[11px] ml-1 text-[#4a3129]/40">({item.size})</span>
                    </span>
                    <span className="shrink-0 font-normal">
                      €{(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#4a3129]/20 pt-4 flex justify-between text-[#4A3129]">
                <span className="uppercase tracking-widest text-sm">Subtotal</span>
                <span className="font-normal text-[16px]">{cartTotal}</span>
              </div>

              <p className="text-[12px] text-[#4a3129]/50 -mt-2">
                Shipping & taxes calculated at checkout.
              </p>

              <button className="w-full bg-[#4A3129] text-white uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#4a3129]/80 transition-all duration-300">
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="text-center text-[12px] uppercase tracking-widest text-[#4a3129]/50 hover:text-[#4a3129] transition-colors duration-200"
              >
                ← Continue Shopping
              </Link>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}
