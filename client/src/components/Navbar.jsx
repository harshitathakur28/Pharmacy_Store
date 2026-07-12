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
        <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-bold text-brand-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">+</span>
          MediCart
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full flex-1 sm:order-none sm:w-auto">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicines, categories..."
            className="input"
          />
        </form>

        <nav className="ml-auto flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link to="/cart" className="relative flex items-center gap-1 hover:text-brand-700">
            Cart
            {totalItems > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1 rounded-lg px-2 py-1 hover:bg-slate-100"
              >
                {user.name.split(' ')[0]}
                <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5.5 7.5L10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <Link to="/my-orders" className="block px-4 py-2 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                    My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/orders" className="block px-4 py-2 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                        Manage Orders
                      </Link>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hover:text-brand-700">
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
