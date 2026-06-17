'use client';

import { SectionCard, ProductThumb, Badge } from './DashboardPrimitives';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardWishlistPreview({ wishlistItems }: { wishlistItems: any[] }) {
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
        {wishlistItems.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">
            Your wishlist is empty.
          </div>
        ) : wishlistItems.map((item) => (
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

            {/* Add to Cart CTA */}
            <button
              aria-label={`Add ${item.product} to cart`}
              className="h-9 w-9 rounded-lg bg-gray-50 text-gray-500 hover:bg-[#534AB7] hover:text-white flex items-center justify-center transition-all duration-200 border border-gray-100 hover:border-transparent flex-shrink-0"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
