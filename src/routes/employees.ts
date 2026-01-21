import express from 'express';
import { getAllEmployees, updateEmployeeRole, deleteEmployee } from '../controllers/employeeController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, authorize('admin', 'gerente'), getAllEmployees);
router.put('/:id/role', protect, authorize('admin'), updateEmployeeRole);
router.delete('/:id', protect, authorize('admin'), deleteEmployee);

export default router;
