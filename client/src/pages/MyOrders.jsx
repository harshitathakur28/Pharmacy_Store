import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const STATUS_STYLES = {
  Placed: 'bg-slate-100 text-slate-700',
  Processing: 'bg-amber-100 text-amber-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-brand-100 text-brand-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/orders/my')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="py-16 text-center text-red-600">{error}</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-800">No orders yet</h1>
        <p className="mt-2 text-slate-500">Your placed orders will show up here.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>

      <div className="mt-6 flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-400">Order ID</p>
                <p className="font-mono text-sm text-slate-600">{order._id}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[order.orderStatus]}`}
              >
                {order.orderStatus}
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-1 text-sm text-slate-600">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.name} × {item.qty}
                  </span>
                  <span>₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-sm">
              <span className="text-slate-500">
                {order.paymentMethod} · {order.paymentStatus} ·{' '}
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
              <span className="font-semibold text-slate-800">Total: ₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
