import mongoose from 'mongoose';

export const MEDICINE_CATEGORIES = [
  'Tablets',
  'Syrups',
  'Devices',
  'Personal Care',
  'Supplements',
  'First Aid',
  'Baby Care',
];

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: MEDICINE_CATEGORIES, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, required: true },
    manufacturer: { type: String, required: true, trim: true },
    requiresPrescription: { type: Boolean, default: false },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 'text', description: 'text', manufacturer: 'text' });

export default mongoose.model('Medicine', medicineSchema);
