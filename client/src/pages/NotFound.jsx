import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="animate-fade-up relative flex flex-col items-center justify-center gap-3 overflow-hidden py-24 text-center">
      <div className="animate-float pointer-events-none absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-100/60 blur-3xl" />
      <p className="relative bg-gradient-to-br from-brand-500 to-brand-800 bg-clip-text text-7xl font-extrabold text-transparent">
        404
      </p>
      <h1 className="relative text-xl font-bold text-slate-800">Page not found</h1>
      <p className="relative text-slate-500">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary relative mt-2">
        Back to Home
      </Link>
    </div>
  );
}
