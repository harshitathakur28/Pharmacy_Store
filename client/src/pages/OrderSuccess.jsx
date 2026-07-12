import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';

export default function OrderSuccess() {
  const { id } = useParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();
    api
      .get('/orders/my')
      .then((res) => setOrder(res.data.orders.find((o) => o._id === id) || null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="animate-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-4xl text-white shadow-lg shadow-brand-600/30">
        ✓
      </div>
      <h1 className="animate-fade-up mt-5 text-2xl font-bold text-slate-800">Order placed successfully!</h1>
      <p className="animate-fade-up mt-2 text-slate-500">
        Thank you for your order. We'll get it ready for delivery.
      </p>

      {order && (
        <div className="card animate-fade-up mt-6 p-6 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Order ID</span>
            <span className="font-mono text-slate-700">{order._id}</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-slate-500">Payment Method</span>
            <span className="text-slate-700">
              {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>
          <div className="mt-2 flex justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500">Total</span>
            <span className="font-semibold text-slate-800">₹{order.totalAmount}</span>
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/my-orders" className="btn-secondary">
          View My Orders
        </Link>
        <Link to="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
