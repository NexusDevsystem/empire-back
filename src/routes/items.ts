import express from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/itemController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
    .get(getItems)
    .post(createItem);

router.route('/:id')
    .get(getItem)
    .put(updateItem)
    .delete(authorize('admin'), deleteItem);

export default router;
