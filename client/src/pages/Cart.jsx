import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, removeItem, updateQty, totalAmount, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="animate-fade-up flex flex-col items-center justify-center gap-3 py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">🛒</span>
        <h1 className="text-2xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="text-slate-500">Browse our catalog and add some items.</p>
        <Link to="/" className="btn-primary mt-3 inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up py-4">
      <h1 className="section-heading">
        Your Cart <span className="text-base font-normal text-slate-500">({totalItems} items)</span>
      </h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          {items.map((item) => (
            <div key={item.medicineId} className="card flex flex-wrap items-center gap-4 p-4 transition-shadow hover:shadow-md">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="min-w-[8rem] flex-1">
                <Link
                  to={`/medicines/${item.medicineId}`}
                  className="font-medium text-slate-800 hover:text-brand-700"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-slate-500">₹{item.price} each</p>
              </div>

              <div className="flex items-center rounded-xl border border-slate-300">
                <button
                  type="button"
                  onClick={() => updateQty(item.medicineId, item.qty - 1)}
                  className="px-2.5 py-1 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                <button
                  type="button"
                  onClick={() => updateQty(item.medicineId, item.qty + 1)}
                  className="px-2.5 py-1 text-slate-600 transition-colors hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              <span className="w-20 text-right font-semibold text-slate-800">
                ₹{item.price * item.qty}
              </span>

              <button
                type="button"
                onClick={() => removeItem(item.medicineId)}
                className="text-sm text-red-500 transition-colors hover:text-red-700"
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="card sticky top-20 h-fit p-6">
          <h2 className="font-semibold text-slate-800">Order Summary</h2>
          <div className="mt-4 flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm text-slate-600">
            <span>Delivery</span>
            <span className="font-medium text-brand-600">Free</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-800">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          <button type="button" onClick={handleCheckout} className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
