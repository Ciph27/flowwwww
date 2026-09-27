import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
const departmentController = new DepartmentController();

router.post('/', authenticate, authorize('departments.manage'), departmentController.create);
router.get('/', authenticate, authorize('departments.manage'), departmentController.findAll);
router.get('/:id', authenticate, authorize('departments.manage'), departmentController.findById);
router.put('/:id', authenticate, authorize('departments.manage'), departmentController.update);
router.delete('/:id', authenticate, authorize('departments.manage'), departmentController.delete);

export default router;