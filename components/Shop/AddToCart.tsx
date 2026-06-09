'use client';

import { useState } from 'react';
import { useCart } from '@/lib/cartContext';
import { useRouter } from 'next/navigation';

type Props = {
  id: number;
  title: string;
  price: string;
  image: string;
  sizes: string[];
  link: string;
};

export default function AddToCart({ id, title, price, image, sizes, link }: Props) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAdd = () => {
    if (!selectedSize) {
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    addToCart({ id, title, price, image, size: selectedSize, link });
    // bump qty if > 1
    for (let i = 1; i < qty; i++) {
      addToCart({ id, title, price, image, size: selectedSize, link });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3 mt-2">
      {/* Sizes */}
      <div>
        <p className="text-xs uppercase tracking-widest text-[#4a3129] mb-3">
          Select Size {error && <span className="text-red-500 ml-2 normal-case">— please pick a size</span>}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => { setSelectedSize(size); setError(false); }}
              className={`px-4 py-2 border text-sm uppercase font-normal transition-all duration-300 ${
                selectedSize === size
                  ? 'bg-[#4A3129] text-white border-[#4A3129]'
                  : 'border-[#4A3129] text-[#4a3129] hover:bg-[#4a3129] hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-[#4A3129] w-fit">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-4 py-3 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-lg leading-none"
        >
          −
        </button>
        <span className="px-6 py-3 text-sm text-[#4a3129] border-x border-[#4a3129]/30 min-w-[48px] text-center">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="px-4 py-3 text-[#4a3129] hover:bg-[#4a3129] hover:text-white transition-all duration-200 text-lg leading-none"
        >
          +
        </button>
      </div>

      {/* Add to Bag */}
      <button
        onClick={handleAdd}
        className={`w-full uppercase text-sm font-normal py-4 tracking-widest transition-all duration-300 ${
          added
            ? 'bg-green-700 text-white'
            : 'bg-[#4A3129] text-white hover:bg-[#4a3129]/80'
        }`}
      >
        {added ? '✓ Added to Bag' : 'Add to Bag'}
      </button>

      {/* View Cart shortcut */}
      {added && (
        <button
          onClick={() => router.push('/cart')}
          className="w-full border border-[#4A3129] text-[#4a3129] uppercase text-sm font-normal py-4 tracking-widest hover:bg-[#4a3129] hover:text-white transition-all duration-300"
        >
          View Bag →
        </button>
      )}
    </div>
  );
}
