import express from 'express';
import { getAllTransactions, createTransaction, deleteTransaction } from '../controllers/transactionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'gerente'));

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

export default router;
