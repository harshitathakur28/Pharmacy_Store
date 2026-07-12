import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import MedicineCard from '../components/MedicineCard';
import Spinner from '../components/Spinner';

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
      <section className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-10 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Your health, delivered.</h1>
        <p className="mt-2 max-w-xl text-brand-50">
          Order medicines and healthcare essentials online. Fast delivery, genuine products, pay by cash or UPI.
        </p>
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        {['All', ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryClick(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-brand-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : error ? (
        <p className="py-16 text-center text-red-600">{error}</p>
      ) : medicines.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No medicines found. Try a different search or category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {medicines.map((m) => (
            <MedicineCard key={m._id} medicine={m} />
          ))}
        </div>
      )}
    </div>
  );
}
