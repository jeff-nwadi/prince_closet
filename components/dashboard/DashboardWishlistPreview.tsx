'use client';

import { useState } from 'react';
import { SectionCard, ProductThumb, Badge } from './DashboardPrimitives';
import { ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cartContext';

export default function DashboardWishlistPreview({ wishlistItems: initialItems }: { wishlistItems: any[] }) {
  const [items, setItems] = useState(initialItems);
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAddToCart = (item: any) => {
    // Add to cart with first size option or standard "M"
    const size = item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'M';
    addToCart({
      id: Number(item.productId),
      title: item.product,
      price: item.price,
      image: item.thumbnail,
      size,
      link: item.link || `/shop/${item.productId}`,
    });
  };

  const handleRemoveFromWishlist = async (productId: string, id: string) => {
    setRemovingId(id);
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <SectionCard
      title="Wishlist Preview"
      action={
        <Link
          href="/shop"
          className="text-xs font-medium text-[#534AB7] hover:underline"
        >
          View all
        </Link>
      }
    >
      <div className="flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">
            Your wishlist is empty.
          </div>
        ) : items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-1 group"
          >
            {/* Thumbnail + Details */}
            <div className="flex items-center gap-3 min-w-0">
              {item.thumbnail.startsWith('/') ? (
                <div className="h-10 w-10 rounded-lg flex-shrink-0 relative overflow-hidden bg-gray-100">
                  <Image src={item.thumbnail} alt={item.product} fill className="object-cover" />
                </div>
              ) : (
                <ProductThumb colorClass={item.thumbnail} size="sm" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate pr-2">
                  {item.product}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-gray-950">
                    {item.price}
                  </span>
                  {item.onSale && item.originalPrice && (
                    <>
                      <span className="text-[11px] text-gray-400 line-through">
                        {item.originalPrice}
                      </span>
                      <Badge variant="green">Sale</Badge>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Add to Cart CTA */}
              <button
                onClick={() => handleAddToCart(item)}
                aria-label={`Add ${item.product} to cart`}
                className="h-9 w-9 rounded-lg bg-gray-50 text-gray-500 hover:bg-[#534AB7] hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-100 hover:border-transparent cursor-pointer"
              >
                <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              </button>

              {/* Remove from Wishlist CTA */}
              <button
                onClick={() => handleRemoveFromWishlist(item.productId, item.id)}
                disabled={removingId === item.id}
                aria-label={`Remove ${item.product} from wishlist`}
                className="h-9 w-9 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all duration-200 border border-gray-100 disabled:opacity-50 cursor-pointer"
              >
                {removingId === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                ) : (
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
