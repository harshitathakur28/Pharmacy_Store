import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const STATUSES = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api
      .get('/orders')
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleStatusChange(orderId, orderStatus) {
    setUpdatingId(orderId);
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus });
      setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data.order : o)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  }

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

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-slate-800">Admin · Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-slate-500">No orders placed yet.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order._id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400">Order ID</p>
                  <p className="font-mono text-sm text-slate-600">{order._id}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {order.user?.name} · {order.user?.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="input !w-auto"
                    value={order.orderStatus}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {updatingId === order._id && <Spinner size={16} />}
                </div>
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

              <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
                <p>
                  {order.shippingAddress.line1}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
                <p>Phone: {order.shippingAddress.phone}</p>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-slate-500">
                  {order.paymentMethod} · {order.paymentStatus} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold text-slate-800">Total: ₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
