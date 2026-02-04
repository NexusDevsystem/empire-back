import express from 'express';
import { protect, authorize } from '../middleware/auth';
import { getSettings, updateSettings } from '../controllers/settingsController';

const router = express.Router();

router.use(protect);

// Allow any authenticated user to view settings
router.get('/', getSettings);

// Only admin can update settings
router.put('/', authorize('admin'), updateSettings);

export default router;
