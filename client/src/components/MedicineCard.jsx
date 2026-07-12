import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MedicineCard({ medicine }) {
  const { addItem } = useCart();
  const outOfStock = medicine.stock <= 0;

  return (
    <div className="card flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link to={`/medicines/${medicine._id}`} className="block bg-slate-50">
        <img
          src={medicine.imageUrl}
          alt={medicine.name}
          className="h-40 w-full object-cover"
          loading="lazy"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
          {medicine.category}
        </span>
        <Link to={`/medicines/${medicine._id}`} className="font-semibold text-slate-800 hover:text-brand-700">
          {medicine.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{medicine.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-slate-900">₹{medicine.price}</span>
          {outOfStock ? (
            <span className="text-xs font-medium text-red-600">Out of stock</span>
          ) : (
            <button
              type="button"
              onClick={() => addItem(medicine, 1)}
              className="btn-primary !px-3 !py-1.5 text-sm"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
