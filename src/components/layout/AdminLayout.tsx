import { useState, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';

const navItems = [
  { to: '/admin', label: '📊 Tổng quan', end: true },
  { to: '/admin/orders', label: '🧾 Quản lý Hóa đơn', end: false },
  { to: '/admin/products', label: '📦 Quản lý Sản phẩm', end: false },
  { to: '/admin/brands', label: '🏷️ Thương hiệu', end: false },
  { to: '/admin/materials', label: '🧶 Chất liệu', end: false },
  { to: '/admin/categories', label: '🗂️ Danh mục', end: false },
  { to: '/admin/attributes', label: '⚙️ Thuộc tính SP', end: false },
  { to: '/admin/accounts', label: '👥 Tài khoản', end: false },
  { to: '/admin/payment-methods', label: '💳 P.Thức Thanh toán', end: false },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile nav)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Lock body scroll when sidebar open on mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`;

  const sidebar = (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
        <Link to="/admin" className="font-extrabold text-xl text-indigo-400 tracking-tight">
          ⚡ Admin Panel
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Đóng menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700 space-y-2 shrink-0">
        <Link
          to="/"
          className="block text-sm text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          ← Trang chủ
        </Link>
        <button
          onClick={() => void logout()}
          className="w-full text-left text-sm text-red-400 hover:text-red-300 px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* ── Desktop Sidebar (always visible ≥ md) ── */}
      <div className="hidden md:flex w-64 shrink-0 sticky top-0 h-screen">
        {sidebar}
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Slide-in panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col md:hidden animate-in slide-in-from-left duration-300">
            {sidebar}
          </div>
        </>
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-30 bg-slate-900 text-white px-4 h-14 flex items-center gap-3 shadow-lg shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Mở menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-extrabold text-indigo-400 tracking-tight">⚡ Admin Panel</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
