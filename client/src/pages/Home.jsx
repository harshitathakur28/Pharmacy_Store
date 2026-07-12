import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import MedicineCard from '../components/MedicineCard';

function MedicineCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton h-40 w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-3 w-16" />
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="mt-2 flex items-center justify-between">
          <div className="skeleton h-5 w-12" />
          <div className="skeleton h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'All';

  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;

    api
      .get('/medicines', { params })
      .then((res) => {
        setMedicines(res.data.medicines);
        setCategories(res.data.categories);
      })
      .catch(() => setError('Failed to load medicines. Please try again.'))
      .finally(() => setLoading(false));
  }, [search, category]);

  function handleCategoryClick(cat) {
    const params = new URLSearchParams(searchParams);
    if (cat === 'All') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  }

  return (
    <div>
      <section className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-6 py-14 text-white shadow-xl shadow-brand-900/20 sm:px-12 sm:py-16">
        <div className="animate-float absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="animate-float absolute -bottom-20 left-1/4 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl [animation-delay:-3s]" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="relative animate-fade-up">
          <span className="badge bg-white/15 text-brand-50 backdrop-blur">
            🚚 Free delivery on every order
          </span>
          <h1 className="mt-4 max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Your health, delivered to your door.
          </h1>
          <p className="mt-3 max-w-xl text-brand-50/90 sm:text-lg">
            Order medicines and healthcare essentials online. Fast delivery, genuine products,
            pay by cash or UPI.
          </p>
        </div>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 ${
              category === cat
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {search && (
        <p className="mb-4 text-sm text-slate-500">
          Showing results for <span className="font-medium text-slate-700">"{search}"</span>
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MedicineCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">⚠️</span>
          <p className="text-red-600">{error}</p>
        </div>
      ) : medicines.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">🔍</span>
          <p className="text-slate-500">No medicines found. Try a different search or category.</p>
        </div>
      ) : (
        <div className="animate-fade-in grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {medicines.map((m, i) => (
            <div key={m._id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
              <MedicineCard medicine={m} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
