import { Router } from 'express';
import { DriverController } from './drivers.controller';
import { AuthMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.requireAdmin);

router.get('/', DriverController.getAll);
router.post('/', DriverController.create);
router.get('/stats', DriverController.getStats);
router.patch('/:id', DriverController.update);

export const driverRoutes = router;
