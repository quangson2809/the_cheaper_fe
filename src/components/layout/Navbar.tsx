import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/store/AuthContext';
import { useCartContext } from '@/store/CartContext';
import { useAuth } from '@/hooks/auth/useAuth';
import { useProfile } from '@/hooks/user/useProfile';
import { Spinner } from '@/components/ui';

export function Navbar() {
  const { isAdmin, isAuthenticated, user } = useAuthContext();
  const { cartCount } = useCartContext();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { profile: accountData, isLoading: isFetchingAccount, refetch } = useProfile(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccountClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && isAuthenticated && !accountData) {
      void refetch();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-white/60 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-indigo-700 tracking-tight">
          <span className="bg-indigo-600 text-white rounded-xl px-2 py-0.5 text-sm font-black">TC</span>
          TheCheaper
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <NavLink to="/products" className={({ isActive }) => isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'}>
            Sản phẩm
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive ? 'text-indigo-600 font-semibold' : 'hover:text-indigo-600 transition-colors'
              }
            >
              Đơn hàng
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
              Admin
            </NavLink>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Link to="/search" aria-label="Tìm kiếm" className="p-2 text-slate-500 hover:text-indigo-600 transition-colors text-lg">
            🔍
          </Link>

          {/* Cart */}
          <Link to="/cart" aria-label="Giỏ hàng" className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors text-lg">
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Account Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleAccountClick}
              aria-label="Tài khoản"
              className={`p-2 transition-colors text-lg rounded-full ${isDropdownOpen ? 'text-indigo-600 bg-indigo-50' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
            >
              👤
            </button>

            {/* Dropdown Content */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                {isAuthenticated ? (
                  <div className="p-4">
                    {isFetchingAccount ? (
                      <div className="flex justify-center py-4">
                        <Spinner size="sm" />
                      </div>
                    ) : accountData ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-slate-50">
                          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                            {accountData.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">{accountData.name}</p>
                            <p className="text-xs text-slate-500 truncate">{accountData.email}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <span>👤</span> Hồ sơ của tôi
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <span>📦</span> Lịch sử đơn hàng
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            >
                              <span>🛡️</span> Quản trị hệ thống
                            </Link>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            void logout();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors border-t border-slate-50 mt-1"
                        >
                          <span>🚪</span> Đăng xuất
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-sm text-slate-500">
                        Không thể tải thông tin.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                      👤
                    </div>
                    <p className="text-slate-800 font-bold mb-1">Chào mừng bạn</p>
                    <p className="text-slate-500 text-xs mb-4">Đăng nhập để nhận nhiều ưu đãi hơn</p>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
                    >
                      Đăng nhập
                    </button>
                    <Link
                      to="/register"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block mt-3 text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      Tạo tài khoản mới
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

// ── Footer ────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <p className="font-extrabold text-white text-lg mb-2">TheCheaper</p>
          <p className="text-sm">Mua sắm thông minh, tiết kiệm thật sự.</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Khám phá</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/products" className="hover:text-white transition-colors">Sản phẩm</Link></li>
            <li><Link to="/search" className="hover:text-white transition-colors">Tìm kiếm</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Tài khoản</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/profile" className="hover:text-white transition-colors">Hồ sơ</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Đơn hàng</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 text-center py-4 text-xs">
        © {new Date().getFullYear()} TheCheaper. All rights reserved.
      </div>
    </footer>
  );
}
