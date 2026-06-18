'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type CartItem = {
  id: number;
  title: string;
  price: string;
  image: string;
  size: string;
  quantity: number;
  link: string;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQty: (id: number, size: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: string;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('pc_cart');
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setMounted(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('pc_cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: number, size: string) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  }, []);

  const updateQty = useCallback((id: number, size: string, qty: number) => {
    if (qty < 1) {
      setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity: qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Parse "€89" → 89, sum up
  const cartTotal = (() => {
    const total = items.reduce((sum, item) => {
      const numeric = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + numeric * item.quantity;
    }, 0);
    return `€${total.toFixed(2)}`;
  })();

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
