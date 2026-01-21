import express from 'express';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', (req, res) => res.json([]));

export default router;
