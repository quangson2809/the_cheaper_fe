import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/store/AuthContext';
import { useCartContext } from '@/store/CartContext';
import { toast } from '@/store/ToastContext';
import * as authService from '@/services/auth.service';
import * as cartService from '@/services/cart.service';
import type { LoginRequest, RegisterRequest, ChangePasswordRequest } from '@/types/auth.types';

export function useAuth() {
  const { setAuth, clearAuth, user, isAuthenticated, isAdmin } = useAuthContext();
  const { resetCart } = useCartContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMergeCart() {
    const guestCart = localStorage.getItem('guestCart');
    if (guestCart) {
      try {
        const items = JSON.parse(guestCart);
        if (Array.isArray(items) && items.length > 0) {
          await cartService.mergeCart({ items });
          localStorage.removeItem('guestCart');
        }
      } catch (err) {
        console.error('Failed to merge cart:', err);
      }
    }
  }

  async function login(data: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(data);
      if (res.data) {
        setAuth(res.data);
        await handleMergeCart();
        navigate(res.data.role === 'ADMIN' ? '/admin' : '/');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(data);
      if (res.data) {
        setAuth(res.data);
        await handleMergeCart();
        navigate('/');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
    } catch (err: unknown) {
      console.error('Remote logout failed', err);
    } finally {
      clearAuth();
      resetCart();
      toast.success('Đăng xuất thành công');
      navigate('/');
    }
  }

  async function changePassword(data: ChangePasswordRequest) {
    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(data);
      return true;
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Đổi mật khẩu thất bại.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return { user, isAuthenticated, isAdmin, isLoading, error, login, register, logout, changePassword };
}
