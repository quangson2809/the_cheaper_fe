import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';

const navItems = [
  { to: '/admin', label: 'Tổng quan', end: true, icon: 'grid' },
  { to: '/admin/orders', label: 'Đơn hàng', end: false, icon: 'receipt' },
  { to: '/admin/products', label: 'Sản phẩm', end: false, icon: 'box' },
  { to: '/admin/brands', label: 'Thương hiệu', end: false, icon: 'tag' },
  { to: '/admin/materials', label: 'Chất liệu', end: false, icon: 'layers' },
  { to: '/admin/categories', label: 'Danh mục', end: false, icon: 'folder' },
  { to: '/admin/attributes', label: 'Thuộc tính', end: false, icon: 'sliders' },
  { to: '/admin/accounts', label: 'Tài khoản', end: false, icon: 'users' },
  { to: '/admin/payment-methods', label: 'Thanh toán', end: false, icon: 'credit-card' },
];

function NavIcon({ name }: { name: string }) {
  const common = 'h-[18px] w-[18px]';
  const paths: Record<string, JSX.Element> = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    receipt: <><path d="M5 4h14v16l-2-1.3L15 20l-2-1.3L11 20l-2-1.3L7 20l-2-1.3V4Z" /><path d="M8 8h8M8 12h8" /></>,
    box: <><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4.5 7.8 7.5 4.3 7.5-4.3M12 12.1V21" /></>,
    tag: <><path d="m20 13-7 7-9-9V4h7l9 9Z" /><circle cx="8.5" cy="8.5" r="1" /></>,
    layers: <><path d="m12 4 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4M4 16l8 4 8-4" /></>,
    folder: <><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H10l2 2h5.5A2.5 2.5 0 0 1 20 8.5V17a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6.5Z" /></>,
    sliders: <><path d="M6 4v16M18 4v16M4 8h4M16 16h4M4 16h4M16 8h4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M15 5.5a3 3 0 0 1 0 5.8M16 14.5a5 5 0 0 1 4.5 5" /></>,
    'credit-card': <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  };

  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const sidebar = (
    <aside className="flex h-full w-[264px] flex-col border-r border-slate-800 bg-[#0d1117] text-white">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold shadow-lg shadow-indigo-950/30">TC</span>
          <span>
            <span className="block text-sm font-semibold tracking-tight text-white">The Cheaper</span>
            <span className="block text-[11px] text-slate-500">Admin console</span>
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="ml-auto rounded-md p-2 text-slate-500 hover:bg-slate-800 hover:text-slate-200 md:hidden"
          aria-label="Đóng menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="px-4 pt-5">
        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">Workspace</p>
        <nav className="space-y-1">
          {navItems.map(({ to, label, end, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${isActive ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-950/30' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'}`}
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}><NavIcon name={icon} /></span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-slate-800 p-4">
        <Link to="/" className="mb-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100">
          <span className="text-base">↗</span>
          Xem cửa hàng
        </Link>
        <button onClick={() => void logout()} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-slate-500 hover:bg-red-950/40 hover:text-red-300">
          <span className="text-base">↪</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      <div className="hidden md:fixed md:inset-y-0 md:flex">{sidebar}</div>

      {isSidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/35 md:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
          <div className="fixed inset-y-0 left-0 z-50 flex md:hidden">{sidebar}</div>
        </>
      )}

      <div className="md:pl-[264px]">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur md:px-8">
          <button onClick={() => setIsSidebarOpen(true)} className="mr-3 rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden" aria-label="Mở menu">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-400">The Cheaper / Admin</p>
            <p className="truncate text-sm font-semibold text-slate-800">{location.pathname === '/admin' ? 'Tổng quan' : 'Quản trị hệ thống'}</p>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500">System online</span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="admin-page">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
