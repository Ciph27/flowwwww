import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
const userController = new UserController();

router.post('/', authenticate, authorize('users.manage'), userController.create);
router.get('/', authenticate, authorize('users.manage'), userController.findAll);
router.get('/:id', authenticate, authorize('users.manage'), userController.findById);
router.put('/:id', authenticate, authorize('users.manage'), userController.update);
router.delete('/:id', authenticate, authorize('users.manage'), userController.delete);

export default router;