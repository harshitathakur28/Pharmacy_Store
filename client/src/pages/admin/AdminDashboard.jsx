import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

export default function AdminDashboard() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  function loadMedicines() {
    setLoading(true);
    api
      .get('/medicines')
      .then((res) => setMedicines(res.data.medicines))
      .catch(() => setError('Failed to load medicines.'))
      .finally(() => setLoading(false));
  }

  useEffect(loadMedicines, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/medicines/${id}`);
      setMedicines((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete medicine.');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Admin · Medicines</h1>
        <Link to="/admin/medicines/new" className="btn-primary">
          + Add Medicine
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner size={32} />
        </div>
      ) : error ? (
        <p className="py-16 text-center text-red-600">{error}</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-2 pr-4 font-medium">Medicine</th>
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Stock</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m._id} className="border-b border-slate-100">
                  <td className="flex items-center gap-3 py-3 pr-4">
                    <img src={m.imageUrl} alt={m.name} className="h-10 w-10 rounded-md object-cover" />
                    <span className="font-medium text-slate-800">{m.name}</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{m.category}</td>
                  <td className="py-3 pr-4 text-slate-600">₹{m.price}</td>
                  <td className="py-3 pr-4">
                    <span className={m.stock === 0 ? 'text-red-600' : 'text-slate-600'}>
                      {m.stock}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/medicines/${m._id}/edit`}
                        className="text-brand-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === m._id}
                        onClick={() => handleDelete(m._id, m.name)}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === m._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
