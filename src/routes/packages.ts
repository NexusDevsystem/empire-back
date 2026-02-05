import { Router } from 'express';
import { packageController } from '../controllers/packageController';

const router = Router();

router.post('/', packageController.create);
router.get('/', packageController.getAll);
router.get('/:id', packageController.getById);
router.put('/:id', packageController.update);
router.delete('/:id', packageController.delete);

export default router;
