import express from 'express';
import { getReceipts, createReceipt, deleteReceipt } from '../controllers/receiptController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/', getReceipts);
router.post('/', createReceipt);
router.delete('/:id', deleteReceipt);

export default router;
