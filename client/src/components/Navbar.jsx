import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    navigate(`/?${params.toString()}`);
  }

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30 transition-transform duration-200 group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>
          <span>
            Medi<span className="text-brand-600">Cart</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full flex-1 sm:order-none sm:w-auto sm:max-w-md">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search medicines, categories..."
              className="input !pl-9"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/cart" className="relative flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-brand-700">
            <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
              <path
                d="M3 4h1.5l1.2 8.4a1.5 1.5 0 0 0 1.5 1.3h6.8a1.5 1.5 0 0 0 1.48-1.24L16.6 7H5.2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="17" r="1.2" fill="currentColor" />
              <circle cx="14.5" cy="17" r="1.2" fill="currentColor" />
            </svg>
            <span className="hidden sm:inline">Cart</span>
            {totalItems > 0 && (
              <span className="animate-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white ring-2 ring-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                >
                  <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              {menuOpen && (
                <div
                  className="animate-fade-up absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-900/10"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link to="/my-orders" className="block px-4 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-700" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <div className="my-1 border-t border-slate-100" />
                      <Link to="/admin" className="block px-4 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-700" onClick={() => setMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/orders" className="block px-4 py-2 text-sm transition-colors hover:bg-brand-50 hover:text-brand-700" onClick={() => setMenuOpen(false)}>
                        Manage Orders
                      </Link>
                    </>
                  )}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 hover:text-brand-700">
                Login
              </Link>
              <Link to="/signup" className="btn-primary !px-3 !py-1.5 text-sm">
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
