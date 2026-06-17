'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

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

  const { data: session } = authClient.useSession();
  const [inWishlist, setInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;
    const checkWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist?productId=${id}`);
        if (res.ok) {
          const data = await res.json();
          setInWishlist(data.inWishlist);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkWishlist();
  }, [id, session]);

  const handleToggleWishlist = async () => {
    if (!session?.user) {
      router.push(`/login?callbackUrl=/shop/${id}`);
      return;
    }
    setIsWishlistLoading(true);
    try {
      const method = inWishlist ? 'DELETE' : 'POST';
      const url = inWishlist ? `/api/wishlist?productId=${id}` : `/api/wishlist`;
      const body = inWishlist ? null : JSON.stringify({ productId: id });
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      if (res.ok) {
        setInWishlist(!inWishlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsWishlistLoading(false);
    }
  };

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

      {/* Buttons Row */}
      <div className="flex gap-4 mt-2">
        <button
          onClick={handleAdd}
          className={`flex-1 uppercase text-sm font-normal py-4 tracking-widest transition-all duration-300 ${
            added
              ? 'bg-green-700 text-white'
              : 'bg-[#4A3129] text-white hover:bg-[#4a3129]/80'
          }`}
        >
          {added ? '✓ Added to Bag' : 'Add to Bag'}
        </button>
        <button
          onClick={handleToggleWishlist}
          disabled={isWishlistLoading}
          className={`px-6 py-4 border border-[#4A3129] flex items-center justify-center transition-all duration-300 hover:bg-[#4a3129] hover:text-white group disabled:opacity-50 ${
            inWishlist
              ? 'bg-[#4A3129] text-white hover:bg-[#3a2520]'
              : 'text-[#4A3129] hover:text-white'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${inWishlist ? 'fill-current' : ''}`} />
        </button>
      </div>

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
