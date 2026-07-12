import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MedicineCard({ medicine }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = medicine.stock <= 0;

  function handleAdd() {
    addItem(medicine, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="card card-hover group flex flex-col overflow-hidden">
      <Link to={`/medicines/${medicine._id}`} className="relative block overflow-hidden bg-slate-50">
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {medicine.requiresPrescription && (
          <span className="badge absolute left-2 top-2 bg-amber-100/95 text-amber-700 backdrop-blur">
            Rx
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px]">
            <span className="badge bg-white text-red-600">Out of stock</span>
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {medicine.category}
        </span>
        <Link to={`/medicines/${medicine._id}`} className="font-semibold text-slate-800 transition-colors hover:text-brand-700">
          {medicine.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{medicine.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">₹{medicine.price}</span>
          {!outOfStock && (
            <button
              type="button"
              onClick={handleAdd}
              className={`!px-3 !py-1.5 text-sm transition-all ${added ? 'btn-secondary !border-brand-500 !text-brand-700' : 'btn-primary'}`}
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
