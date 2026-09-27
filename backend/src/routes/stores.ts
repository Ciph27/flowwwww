import { Router } from 'express';
import { StoreController } from '../controllers/storeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();
const storeController = new StoreController();

router.post('/', authenticate, authorize('stores.manage'), storeController.create);
router.get('/', authenticate, authorize('stores.manage'), storeController.findAll);
router.get('/:id', authenticate, authorize('stores.manage'), storeController.findById);
router.put('/:id', authenticate, authorize('stores.manage'), storeController.update);
router.delete('/:id', authenticate, authorize('stores.manage'), storeController.delete);

export default router;