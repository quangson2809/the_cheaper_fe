import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface CartContextValue {
  cartCount: number;
  setCartCount: (count: number) => void;
  resetCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Run one-time cleanup for legacy mock data (variantId 7 and 15)
    const hasCleaned = localStorage.getItem('cart_cleaned_legacy_mock');
    let currentGuestCart = localStorage.getItem('guestCart');

    if (!hasCleaned) {
      if (currentGuestCart) {
        try {
          const items = JSON.parse(currentGuestCart);
          if (Array.isArray(items)) {
            // Filter out the legacy mock items (variantId: 7 and 15)
            const cleanedItems = items.filter((item: any) => item.variantId !== 7 && item.variantId !== 15);
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
        const items = JSON.parse(currentGuestCart);
        if (Array.isArray(items)) {
          setCartCount(items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0));
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
