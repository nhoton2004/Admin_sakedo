import { Router } from 'express';
import { UsersController } from './users.controller';

const router = Router();
const controller = new UsersController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.patch('/:id/toggle-active', controller.toggleActive);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
