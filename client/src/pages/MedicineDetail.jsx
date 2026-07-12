import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

export default function MedicineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [medicine, setMedicine] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setAdded(false);
    setQty(1);
    api
      .get(`/medicines/${id}`)
      .then((res) => setMedicine(res.data.medicine))
      .catch(() => setError('Medicine not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="py-24 text-center">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-brand-700 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    addItem(medicine, qty);
    setAdded(true);
  }

  function handleBuyNow() {
    addItem(medicine, qty);
    navigate('/cart');
  }

  return (
    <div className="animate-fade-up grid gap-10 py-4 md:grid-cols-2">
      <nav className="col-span-full -mb-4 flex items-center gap-1.5 text-sm text-slate-400">
        <Link to="/" className="transition-colors hover:text-brand-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-slate-500">{medicine.category}</span>
      </nav>

      <div className="card relative aspect-square overflow-hidden bg-slate-50">
        <img src={medicine.imageUrl} alt={medicine.name} className="h-full w-full object-cover" />
        {medicine.requiresPrescription && (
          <span className="badge absolute left-4 top-4 bg-amber-100/95 text-amber-700 backdrop-blur">
            Prescription required
          </span>
        )}
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          {medicine.category}
        </span>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">{medicine.name}</h1>
        <p className="mt-1 text-sm text-slate-500">by {medicine.manufacturer}</p>

        <p className="mt-5 leading-relaxed text-slate-600">{medicine.description}</p>

        <div className="mt-6 flex items-baseline gap-3 border-t border-slate-100 pt-6">
          <span className="text-3xl font-bold text-slate-900">₹{medicine.price}</span>
          {medicine.stock > 0 ? (
            <span className="badge bg-brand-50 text-brand-700">In stock · {medicine.stock} available</span>
          ) : (
            <span className="badge bg-red-50 text-red-600">Out of stock</span>
          )}
        </div>

        {medicine.stock > 0 && (
          <>
            <div className="mt-6 flex items-center gap-3">
              <span className="label !mb-0">Quantity</span>
              <div className="flex items-center rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-10 text-center font-medium">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(medicine.stock, q + 1))}
                  className="px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={handleAddToCart} className="btn-secondary">
                {added ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button type="button" onClick={handleBuyNow} className="btn-primary">
                Buy Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
