import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { Spinner } from '@/components/ui';
import AdminPaymentMethodListPage from '@/pages/admin/AdminPaymentMethodListPage';

// ── Layouts ───────────────────────────────────────────
const UserLayout = lazy(() => import('@/components/layout/UserLayout'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));

// ── Public pages ──────────────────────────────────────
const HomePage = lazy(() => import('@/pages/public/HomePage'));
const ProductListPage = lazy(() => import('@/pages/public/ProductListPage'));
const ProductDetailPage = lazy(() => import('@/pages/public/ProductDetailPage'));
const SearchPage = lazy(() => import('@/pages/public/SearchPage'));

// ── Auth pages ────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// ── User pages ────────────────────────────────────────
const ProfilePage = lazy(() => import('@/pages/user/ProfilePage'));
const AddressPage = lazy(() => import('@/pages/user/AddressPage'));
const CartPage = lazy(() => import('@/pages/user/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/user/CheckoutPage'));
const OrderListPage = lazy(() => import('@/pages/user/OrderListPage'));
const OrderDetailPage = lazy(() => import('@/pages/user/OrderDetailPage'));

// ── Admin pages ───────────────────────────────────────
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductListPage = lazy(() => import('@/pages/admin/AdminProductListPage'));
const AdminProductDetailPage = lazy(() => import('@/pages/admin/AdminProductDetailPage'));
const AdminOrderListPage = lazy(() => import('@/pages/admin/AdminOrderListPage'));
const AdminOrderDetailPage = lazy(() => import('@/pages/admin/AdminOrderDetailPage'));
const AdminAccountListPage = lazy(() => import('@/pages/admin/AdminAccountListPage'));
const AdminBrandListPage = lazy(() => import('@/pages/admin/AdminBrandListPage'));
const AdminMaterialListPage = lazy(() => import('@/pages/admin/AdminMaterialListPage'));
const AdminCategoryListPage = lazy(() => import('@/pages/admin/AdminCategoryListPage'));
const AdminAttributeListPage = lazy(() => import('@/pages/admin/AdminAttributeListPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="lg" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public (with user Navbar) ── */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* ── Auth ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ── Protected user routes ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/addresses" element={<AddressPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
            </Route>
          </Route>

          {/* ── Admin (separate layout, no user Navbar) ── */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardPage />} />
              <Route path="/admin/products" element={<AdminProductListPage />} />
              <Route path="/admin/products/:id" element={<AdminProductDetailPage />} />
              <Route path="/admin/orders" element={<AdminOrderListPage />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
              <Route path="/admin/accounts" element={<AdminAccountListPage />} />
              <Route path="/admin/brands" element={<AdminBrandListPage />} />
              <Route path="/admin/materials" element={<AdminMaterialListPage />} />
              <Route path="/admin/categories" element={<AdminCategoryListPage />} />
              <Route path="/admin/attributes" element={<AdminAttributeListPage />} />
              <Route path="/admin/payment-methods" element={<AdminPaymentMethodListPage />} />
            </Route>
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
