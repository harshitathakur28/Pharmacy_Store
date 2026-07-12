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
    <div className="animate-fade-up py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="section-heading">Admin · Medicines</h1>
          <p className="mt-1 text-sm text-slate-500">{medicines.length} products in catalog</p>
        </div>
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
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500">
                <th className="px-4 py-3 font-medium">Medicine</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m._id} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-brand-50/40">
                  <td className="flex items-center gap-3 px-4 py-3">
                    <img src={m.imageUrl} alt={m.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="font-medium text-slate-800">{m.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{m.category}</td>
                  <td className="px-4 py-3 text-slate-600">₹{m.price}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${m.stock === 0 ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                      {m.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/medicines/${m._id}/edit`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={deletingId === m._id}
                        onClick={() => handleDelete(m._id, m.name)}
                        className="font-medium text-red-600 hover:underline disabled:opacity-50"
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
