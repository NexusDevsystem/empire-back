import express from 'express';
import { getAllContracts, createContract, updateContract, deleteContract } from '../controllers/contractController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getAllContracts);
router.post('/', protect, createContract);
router.put('/:id', protect, updateContract);
router.delete('/:id', protect, deleteContract);

export default router;
