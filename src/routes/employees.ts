import express from 'express';
import { getAllEmployees, updateEmployeeRole, deleteEmployee } from '../controllers/employeeController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getAllEmployees);
router.put('/:id/role', protect, updateEmployeeRole);
router.delete('/:id', protect, deleteEmployee);

export default router;
