'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/lib/cartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, CreditCard, Lock, Loader2, ChevronLeft, ArrowRight, Check } from 'lucide-react';

interface CheckoutClientProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function CheckoutClient({ user }: CheckoutClientProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#4A3129] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutClientContent user={user} />
    </Suspense>
  );
}

function CheckoutClientContent({ user }: CheckoutClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error');
  const { items, cartTotal } = useCart();
  
  // Checkout Steps: 'shipping' | 'payment'
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set initial error from URL if present
  useEffect(() => {
    if (errorParam) {
      if (errorParam === 'payment_failed') {
        setError('Your payment via Paystack was declined or cancelled. Please try again.');
      } else if (errorParam === 'gateway_configuration') {
        setError('Payment gateway configuration is missing. Please contact administrator.');
      } else if (errorParam === 'verification_error') {
        setError('An error occurred during payment verification. If you were charged, please contact support.');
      } else {
        setError('An unexpected payment error occurred. Please try again.');
      }
    }
  }, [errorParam]);

  // Form State: Shipping
  const [firstName, setFirstName] = useState(user.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user.name.split(' ').slice(1).join(' ') || '');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('Ireland');
  const [phone, setPhone] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');

  // Shipping cost formatting
  const shippingCost = shippingMethod === 'standard' ? 0.0 : 15.0;
  const subtotalNum = parseFloat(cartTotal.replace(/[^0-9.]/g, '')) || 0;
  const totalAmountStr = `€${(subtotalNum + shippingCost).toFixed(2)}`;

  // Form validation: Shipping
  function validateShipping() {
    if (!firstName.trim() || !lastName.trim() || !address1.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      setError('Please fill in all required shipping fields.');
      return false;
    }
    setError(null);
    return true;
  }

  // Submit Order to API
  const handlePlaceOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          shippingAddress: {
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            postalCode,
            country,
            phone,
            shippingMethod,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      if (data.url) {
        // Redirect user to Paystack secure transaction page
        window.location.href = data.url;
      } else {
        throw new Error('Payment initialization response did not contain verification url.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f0ea] flex flex-col items-center justify-center pt-28 pb-20 px-6 text-center">
        <p className="heading text-[#4a3129] text-[22px] md:text-[28px] uppercase mb-4">Your Bag is Empty</p>
        <p className="text-[14px] text-[#4a3129]/60 max-w-sm mb-6">
          You must add items to your bag before checking out.
        </p>
        <Link
          href="/shop"
          className="bg-[#4A3129] text-white uppercase text-sm font-normal px-8 py-4 tracking-widest hover:bg-[#4a3129]/80 transition-all duration-300"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const inputClass =
    'w-full bg-transparent border-b border-[#4a3129]/20 focus:border-[#4A3129] outline-none py-3 text-[14px] text-[#4a3129] placeholder:text-[#4a3129]/40 transition-colors duration-300';
  const labelClass = 'text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-0.5';

  return (
    <div className="min-h-screen bg-[#f4f0ea] pt-28 pb-24 px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Form Steps */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 border-b border-[#4a3129]/10 pb-6">
            <button
              onClick={() => step === 'payment' && setStep('shipping')}
              className={`flex items-center gap-2 text-[12px] uppercase tracking-widest ${
                step === 'shipping' ? 'text-[#4A3129] font-bold' : 'text-[#4a3129]/50 hover:text-[#4a3129]'
              }`}
              disabled={step === 'shipping'}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
              Shipping
            </button>
            <div className="h-px bg-[#4a3129]/10 flex-1" />
            <div
              className={`flex items-center gap-2 text-[12px] uppercase tracking-widest ${
                step === 'payment' ? 'text-[#4A3129] font-bold' : 'text-[#4a3129]/50'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
              Payment
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-250/30 text-red-750 text-[13px] px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 'shipping' ? (
              <motion.div
                key="shipping-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <h2 className="heading text-[#4A3129] uppercase text-[20px] md:text-[24px]">Shipping Details</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jefferson"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nwadi"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Street Address *</label>
                  <input
                    type="text"
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                    placeholder="12 Main Street"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Apartment, Suite, etc. (Optional)</label>
                  <input
                    type="text"
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                    placeholder="Apt 4B"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="sm:col-span-1">
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Dublin"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClass}>State / Region</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="Co. Dublin"
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className={labelClass}>Postal Code *</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="D02 YN23"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Country *</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className={`${inputClass} bg-transparent py-3.5 appearance-none cursor-pointer`}
                    >
                      <option value="Ireland" className="bg-[#f4f0ea] text-[#4a3129]">Ireland</option>
                      <option value="Nigeria" className="bg-[#f4f0ea] text-[#4a3129]">Nigeria</option>
                      <option value="United Kingdom" className="bg-[#f4f0ea] text-[#4a3129]">United Kingdom</option>
                      <option value="United States" className="bg-[#f4f0ea] text-[#4a3129]">United States</option>
                      <option value="Germany" className="bg-[#f4f0ea] text-[#4a3129]">Germany</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+353 87 123 4567"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mt-4">
                  <label className={labelClass}>Shipping Method</label>
                  <div className="flex flex-col sm:flex-row gap-4 mt-2">
                    <label className={`flex-1 border p-4 flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'standard' ? 'border-[#4A3129] bg-[#e3dbcf]/25' : 'border-[#4a3129]/15 hover:border-[#4a3129]/40'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'standard'}
                          onChange={() => setShippingMethod('standard')}
                          className="accent-[#4A3129]"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-[#4a3129]">Standard Delivery</p>
                          <p className="text-[12px] text-[#4a3129]/60">3–5 Business Days</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-[#4a3129]">Free</span>
                    </label>

                    <label className={`flex-1 border p-4 flex items-center justify-between cursor-pointer transition-all ${
                      shippingMethod === 'express' ? 'border-[#4A3129] bg-[#e3dbcf]/25' : 'border-[#4a3129]/15 hover:border-[#4a3129]/40'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === 'express'}
                          onChange={() => setShippingMethod('express')}
                          className="accent-[#4A3129]"
                        />
                        <div>
                          <p className="text-[14px] font-medium text-[#4a3129]">Express Courier</p>
                          <p className="text-[12px] text-[#4a3129]/60">1–2 Business Days</p>
                        </div>
                      </div>
                      <span className="text-[13px] font-semibold text-[#4a3129]">€15.00</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => validateShipping() && setStep('payment')}
                  className="mt-4 bg-[#4A3129] text-white uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#3a2520] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continue to Payment
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="payment-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="heading text-[#4A3129] uppercase text-[20px] md:text-[24px]">Payment Method</h2>
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#4a3129]/60 hover:text-[#4a3129]"
                  >
                    <ChevronLeft size={14} /> Back to shipping
                  </button>
                </div>

                <div className="bg-[#e3dbcf]/20 border border-[#dfcac3]/40 p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <CreditCard size={18} className="text-[#4A3129]/70" />
                     <span className="text-[13px] uppercase tracking-wider text-[#4a3129] font-medium">Paystack Secure Checkout</span>
                  </div>
                  <Check size={18} className="text-[#4A3129]" />
                </div>

                <div className="bg-[#e3dbcf]/10 border border-[#dfcac3]/30 p-6 rounded-2xl flex flex-col gap-4">
                  <p className="text-[13px] text-[#4a3129]/80 leading-relaxed">
                    You will be securely redirected to Paystack to complete your payment. Paystack supports multiple payment options including Credit/Debit Cards, Bank Transfer, USSD, and Mobile Money.
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-[#4a3129]/50 tracking-wider uppercase font-medium">
                    <Lock size={13} className="shrink-0" />
                    Secured and Encrypted by Paystack
                  </div>
                </div>

                <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 p-4 mt-2">
                  <Lock size={15} className="text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-500 leading-normal">
                    This is a secure 256-bit encrypted checkout. Your payment details are securely processed directly on Paystack systems and will not be stored on our servers.
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="mt-4 bg-[#4A3129] text-white uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#3a2520] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecting to Paystack...
                    </>
                  ) : (
                    <>
                      Pay Now · {totalAmountStr}
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 bg-[#e3dbcf] p-6 flex flex-col gap-6 sticky top-28 border border-[#dfcac3]/30">
          <h2 className="heading text-[#4A3129] uppercase text-[18px] md:text-[20px] pb-2 border-b border-[#4a3129]/10">
            Order Summary
          </h2>

          {/* Cart items list */}
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="relative w-[50px] h-[65px] bg-[#dfcac3] overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <p className="text-[13px] uppercase font-semibold text-[#4a3129] truncate">{item.title}</p>
                  <p className="text-[11px] text-[#4a3129]/50 uppercase tracking-widest mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                </div>
                <span className="text-[13px] font-medium text-[#4a3129] self-center shrink-0">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 pt-4 border-t border-[#4a3129]/10 text-[13px] text-[#4a3129]">
            <div className="flex justify-between">
              <span className="text-[#4a3129]/70">Subtotal</span>
              <span>{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a3129]/70">Shipping</span>
              <span>{shippingMethod === 'standard' ? 'Free' : '€15.00'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4a3129]/70">Duties & Taxes</span>
              <span>€0.00</span>
            </div>
          </div>

          <div className="border-t border-[#4a3129]/15 pt-4 flex justify-between items-end text-[#4A3129]">
            <span className="uppercase tracking-widest text-[13px] font-bold">Total</span>
            <span className="font-semibold text-[20px] leading-none">{totalAmountStr}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
