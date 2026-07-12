import Medicine, { MEDICINE_CATEGORIES } from '../models/Medicine.js';

export async function listMedicines(req, res, next) {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const medicines = await Medicine.find(filter).sort({ createdAt: -1 });
    res.json({ medicines, categories: MEDICINE_CATEGORIES });
  } catch (err) {
    next(err);
  }
}

export async function getMedicine(req, res, next) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ medicine });
  } catch (err) {
    next(err);
  }
}

export async function createMedicine(req, res, next) {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ medicine });
  } catch (err) {
    next(err);
  }
}

export async function updateMedicine(req, res, next) {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ medicine });
  } catch (err) {
    next(err);
  }
}

export async function deleteMedicine(req, res, next) {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json({ message: 'Medicine deleted' });
  } catch (err) {
    next(err);
  }
}
