import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative mx-auto max-w-md py-8">
      <div className="animate-float pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="animate-float pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-brand-100/60 blur-3xl [animation-delay:-3s]" />

      <div className="card animate-fade-up relative p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M3 10h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Log in to your MediCart account.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label htmlFor="email" className="label">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              required
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
            {submitting ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <p className="font-medium text-slate-600">Demo credentials</p>
          <p>Admin: admin@medicart.com / admin123</p>
          <p>User: user@medicart.com / user1234</p>
        </div>
      </div>
    </div>
  );
}
