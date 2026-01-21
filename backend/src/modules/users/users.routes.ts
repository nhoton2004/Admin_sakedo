import { Router } from 'express';
import { UsersController } from './users.controller';

const router = Router();
const controller = new UsersController();

router.get('/', controller.getAll);
router.post('/', controller.create);
router.patch('/:id/toggle-active', controller.toggleActive);

export default router;
