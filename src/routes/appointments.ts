import express from 'express';
import { getAllAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getAllAppointments);
router.post('/', protect, createAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

export default router;
