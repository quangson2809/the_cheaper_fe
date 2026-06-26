import { useState, useEffect, useCallback } from 'react';
import { useCartContext } from '@/store/CartContext';
import { useAuthContext } from '@/store/AuthContext';
import * as cartService from '@/services/cart.service';
import type { UserCartResponse, UserCartItemResponse } from '@/types/cart.types';

const GUEST_CART_KEY = 'guestCart';

interface GuestCartItem {
  variantId: number;
  quantity: number;
}

export function useCart() {
  const { setCartCount } = useCartContext();
  const { isAuthenticated } = useAuthContext();
  const [cart, setCart] = useState<UserCartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGuestCart = (): GuestCartItem[] => {
    try {
      const stored = localStorage.getItem(GUEST_CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (items: GuestCartItem[]) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
    if (!isAuthenticated) {
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    }
  };

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isAuthenticated) {
      const guestItems = getGuestCart();
      // Since we don't have a batch get variants API yet, and mock is removed,
      // we'll just show placeholders or minimalist items for guests if they only have variantId.
      // In a real app, you'd fetch variant details here.
      const items: UserCartItemResponse[] = guestItems.map((gi) => ({
        id: gi.variantId,
        productId: gi.variantId,
        quantity: gi.quantity,
        price: 0,
        productName: `Sản phẩm #${gi.variantId}`,
        thumbnail: null,
        optionNames: null,
      }));

      const guestCart: UserCartResponse = {
        items,
        totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      };
      setCart(guestCart);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
      setIsLoading(false);
      return;
    }

    try {
      const res = await cartService.getCart();
      if (res.data) {
        setCart(res.data);
        setCartCount(res.data.items.reduce((sum, i) => sum + i.quantity, 0));
      }
    } catch {
      setCart({ items: [], totalPrice: 0 });
      setCartCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [setCartCount, isAuthenticated]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  async function addItem(variantId: number, quantity: number): Promise<boolean> {
    if (!isAuthenticated) {
      const items = getGuestCart();
      const existing = items.find((i) => i.variantId === variantId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        items.push({ variantId, quantity });
      }
      saveGuestCart(items);
      await fetchCart();
      return true;
    }

    try {
      await cartService.addCartItem({ variantId, quantity });
      await fetchCart();
      return true;
    } catch {
      setError('Thêm sản phẩm thất bại.');
      return false;
    }
  }

  async function updateItem(itemId: number, quantity: number): Promise<void> {
    if (!isAuthenticated) {
      const items = getGuestCart();
      const item = items.find((i) => i.variantId === itemId);
      if (item) {
        item.quantity = quantity;
        saveGuestCart(items);
        await fetchCart();
      }
      return;
    }

    try {
      await cartService.updateCartItem(itemId, { quantity });
      await fetchCart();
    } catch {
      setError('Cập nhật thất bại.');
    }
  }

  async function removeItem(itemId: number): Promise<void> {
    if (!isAuthenticated) {
      const items = getGuestCart().filter((i) => i.variantId !== itemId);
      saveGuestCart(items);
      await fetchCart();
      return;
    }

    try {
      await cartService.removeCartItem(itemId);
      await fetchCart();
    } catch {
      setError('Xóa sản phẩm thất bại.');
    }
  }

  return { cart, isLoading, error, addItem, updateItem, removeItem, refetch: fetchCart };
}
