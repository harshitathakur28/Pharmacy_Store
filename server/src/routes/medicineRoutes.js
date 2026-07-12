import { Router } from 'express';
import {
  listMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicineController.js';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';

const router = Router();

router.get('/', listMedicines);
router.get('/:id', getMedicine);
router.post('/', protect, adminOnly, createMedicine);
router.put('/:id', protect, adminOnly, updateMedicine);
router.delete('/:id', protect, adminOnly, deleteMedicine);

export default router;
