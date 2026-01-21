import { Router } from 'express';
import { BannersController } from './banners.controller';
import { AuthMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();
const controller = new BannersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/toggle-active', controller.toggleActive);
router.patch('/reorder', controller.reorder);
router.delete('/:id', controller.delete);

export default router;
