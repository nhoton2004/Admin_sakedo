import { Router } from 'express';
import { OrdersController } from './orders.controller';

const router = Router();
const controller = new OrdersController();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.patch('/:id/confirm', controller.confirm);
router.patch('/:id/preparing', controller.preparing);
router.patch('/:id/ready', controller.ready);
router.patch('/:id/assign-driver', controller.assignDriver);
router.patch('/:id/cancel', controller.cancel);

export default router;
