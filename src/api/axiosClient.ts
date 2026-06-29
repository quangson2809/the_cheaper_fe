import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { toast } from '@/store/ToastContext';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ── Request interceptor — attach JWT ──────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — handle errors globally ─────
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error to console for developers
    console.error('[API Error]:', error.response?.data || error.message);

    // Skip toast for logout endpoint
    const isLogout = error.config?.url?.includes('/api/auth/logout');

    if (error.response?.status === 401) {
      // Unauthorized: clear auth and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('authUser');
      toast.error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      window.location.href = '/login';
    } else if (!isLogout) {
      // Other errors: show user-friendly message (except for logout)
      const message = error.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
