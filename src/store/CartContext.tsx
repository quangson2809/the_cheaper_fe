/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartContextValue {
  cartCount: number;
  setCartCount: (count: number) => void;
  resetCart: () => void;
}

interface GuestCartItem {
  variantId: number;
  quantity?: number;
}

export const CartContext = createContext<CartContextValue | null>(null);

function isGuestCartItem(item: unknown): item is GuestCartItem {
  if (typeof item !== 'object' || item === null) return false;
  const candidate = item as Record<string, unknown>;
  return typeof candidate.variantId === 'number';
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const hasCleaned = localStorage.getItem('cart_cleaned_legacy_mock');
    let currentGuestCart = localStorage.getItem('guestCart');

    if (!hasCleaned) {
      if (currentGuestCart) {
        try {
          const parsed: unknown = JSON.parse(currentGuestCart);
          if (Array.isArray(parsed)) {
            const items = parsed.filter(isGuestCartItem);
            const cleanedItems = items.filter((item) => item.variantId !== 7 && item.variantId !== 15);
            if (cleanedItems.length === 0) {
              localStorage.removeItem('guestCart');
              currentGuestCart = null;
            } else {
              const cleanedStr = JSON.stringify(cleanedItems);
              localStorage.setItem('guestCart', cleanedStr);
              currentGuestCart = cleanedStr;
            }
          }
        } catch {
          localStorage.removeItem('guestCart');
          currentGuestCart = null;
        }
      }
      localStorage.setItem('cart_cleaned_legacy_mock', 'true');
    }

    const isAuth = !!localStorage.getItem('accessToken');
    if (currentGuestCart && !isAuth) {
      try {
        const parsed: unknown = JSON.parse(currentGuestCart);
        if (Array.isArray(parsed)) {
          const items = parsed.filter(isGuestCartItem);
          setCartCount(items.reduce((sum, item) => sum + (item.quantity || 0), 0));
        }
      } catch {
        setCartCount(0);
      }
    }
  }, []);

  function resetCart() {
    setCartCount(0);
  }

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, resetCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>');
  return ctx;
}
