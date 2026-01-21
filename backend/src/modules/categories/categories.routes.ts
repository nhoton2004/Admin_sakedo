import { Router } from 'express';
import { CategoriesController } from './categories.controller';

const router = Router();
const controller = new CategoriesController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id/toggle-active', controller.toggleActive);
router.delete('/:id', controller.delete);

export default router;
