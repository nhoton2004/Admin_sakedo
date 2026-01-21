import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthMiddleware } from '../../common/middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/login', controller.login);

// Protected routes
router.get('/me', AuthMiddleware.verifyToken, controller.me);

export default router;
