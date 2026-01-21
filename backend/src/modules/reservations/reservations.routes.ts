import { Router } from 'express';
import { ReservationsController } from './reservations.controller';

const router = Router();
const controller = new ReservationsController();

router.get('/', controller.getAll);
router.patch('/:id/confirm', controller.confirm);
router.patch('/:id/cancel', controller.cancel);
router.patch('/:id/complete', controller.complete);

export default router;
