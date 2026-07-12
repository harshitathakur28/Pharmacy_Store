import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const UPI_ID_REGEX = /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/;

export default function Checkout() {
  const { items, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    line1: user?.address?.line1 || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    phone: user?.phone || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  function handleAddressChange(field, value) {
    setAddress((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'UPI' && !UPI_ID_REGEX.test(upiId)) {
      setError('Enter a valid UPI ID, e.g. yourname@bank');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ medicineId: i.medicineId, qty: i.qty })),
        paymentMethod,
        upiId: paymentMethod === 'UPI' ? upiId : undefined,
        shippingAddress: address,
      });
      navigate(`/order-success/${res.data.order._id}`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-up py-4">
      <h1 className="section-heading">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-6 grid gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">1</span>
              Shipping Address
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Address</label>
                <input
                  required
                  className="input"
                  value={address.line1}
                  onChange={(e) => handleAddressChange('line1', e.target.value)}
                  placeholder="House no, street, area"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input
                  required
                  className="input"
                  value={address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                />
              </div>
              <div>
                <label className="label">State</label>
                <input
                  required
                  className="input"
                  value={address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Pincode</label>
                <input
                  required
                  className="input"
                  value={address.pincode}
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  required
                  type="tel"
                  className="input"
                  value={address.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs text-brand-700">2</span>
              Payment Method
            </h2>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <label
                className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-150 ${
                  paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/15' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div>
                  <p className="font-medium text-slate-800">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when your order arrives</p>
                </div>
              </label>

              <label
                className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all duration-150 ${
                  paymentMethod === 'UPI' ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-500/15' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                <div>
                  <p className="font-medium text-slate-800">UPI</p>
                  <p className="text-xs text-slate-500">Pay instantly via UPI ID</p>
                </div>
              </label>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="mt-4">
                <label className="label">UPI ID</label>
                <input
                  className="input"
                  placeholder="yourname@bank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <p className="mt-1 text-xs text-slate-400">
                  Simulated payment for demo purposes — no real transaction occurs.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card sticky top-20 h-fit p-6">
          <h2 className="font-semibold text-slate-800">Order Summary</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
            {items.map((item) => (
              <li key={item.medicineId} className="flex justify-between">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-semibold text-slate-800">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}
