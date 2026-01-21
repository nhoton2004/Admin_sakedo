import { Router } from 'express';
import { ProductsController } from './products.controller';

const router = Router();
const controller = new ProductsController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/toggle-active', controller.toggleActive);
router.patch('/:id/toggle-featured', controller.toggleFeatured);
router.delete('/:id', controller.delete);

export default router;
