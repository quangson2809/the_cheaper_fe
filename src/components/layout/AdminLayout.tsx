import { Outlet, NavLink, Link } from 'react-router-dom';
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
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-slate-700">
          <Link to="/admin" className="font-extrabold text-xl text-indigo-400 tracking-tight">
            ⚡ Admin Panel
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700 space-y-2">
          <Link to="/" className="block text-sm text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors">
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

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
