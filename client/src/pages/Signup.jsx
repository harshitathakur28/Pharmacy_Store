import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    try {
      await signup(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
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
            <path d="M4 10c1.5-4 4-6 6-6s4.5 2 6 6-2 6-6 6-7.5-2-6-6Z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Sign up to start ordering medicines online.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {error && (
            <div className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div>
            <label htmlFor="name" className="label">Full name</label>
            <input
              id="name"
              type="text"
              required
              className="input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

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
            <label htmlFor="phone" className="label">Phone (optional)</label>
            <input
              id="phone"
              type="tel"
              className="input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              className="input"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="mt-1 text-xs text-slate-400">At least 6 characters.</p>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
            {submitting ? 'Creating account…' : 'Sign up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
