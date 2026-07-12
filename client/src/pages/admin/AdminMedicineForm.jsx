import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';

const CATEGORIES = [
  'Tablets',
  'Syrups',
  'Devices',
  'Personal Care',
  'Supplements',
  'First Aid',
  'Baby Care',
];

const EMPTY_FORM = {
  name: '',
  description: '',
  category: CATEGORIES[0],
  price: '',
  stock: '',
  imageUrl: '',
  manufacturer: '',
  requiresPrescription: false,
};

export default function AdminMedicineForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/medicines/${id}`)
      .then((res) => {
        const m = res.data.medicine;
        setForm({
          name: m.name,
          description: m.description,
          category: m.category,
          price: m.price,
          stock: m.stock,
          imageUrl: m.imageUrl,
          manufacturer: m.manufacturer,
          requiresPrescription: m.requiresPrescription,
        });
      })
      .catch(() => setError('Failed to load medicine.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      if (isEdit) {
        await api.put(`/medicines/${id}`, payload);
      } else {
        await api.post('/medicines', payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="animate-fade-up mx-auto max-w-2xl py-4">
      <h1 className="section-heading">
        {isEdit ? 'Edit Medicine' : 'Add Medicine'}
      </h1>

      <form onSubmit={handleSubmit} className="card mt-6 flex flex-col gap-4 p-6">
        {error && (
          <div className="animate-fade-in rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}

        <div>
          <label className="label">Name</label>
          <input
            required
            className="input"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            required
            rows={3}
            className="input"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Manufacturer</label>
            <input
              required
              className="input"
              value={form.manufacturer}
              onChange={(e) => handleChange('manufacturer', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Price (₹)</label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              className="input"
              value={form.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>

          <div>
            <label className="label">Stock</label>
            <input
              required
              type="number"
              min="0"
              className="input"
              value={form.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Image URL</label>
          <input
            required
            type="url"
            className="input"
            placeholder="https://..."
            value={form.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.requiresPrescription}
            onChange={(e) => handleChange('requiresPrescription', e.target.checked)}
          />
          Requires prescription
        </label>

        <div className="mt-2 flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Medicine'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
