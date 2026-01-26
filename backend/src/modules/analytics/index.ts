import { Router } from 'express';
import { AuthMiddleware } from '../../common/middleware/auth.middleware';
import { Role } from '../../common/enums';
import { AnalyticsController } from './analytics.controller';

const router = Router();
const controller = new AnalyticsController();

// All analytics routes require authentication and ADMIN or STAFF role
router.use(AuthMiddleware.verifyToken);
router.use(AuthMiddleware.requireRole(Role.ADMIN, Role.STAFF));

/**
 * @route   GET /admin/analytics
 * @desc    Get complete analytics data
 * @access  Admin, Staff
 */
router.get('/', controller.getAnalytics);

/**
 * @route   GET /admin/analytics/revenue
 * @desc    Get daily revenue data
 * @access  Admin, Staff
 */
router.get('/revenue', controller.getDailyRevenue);

/**
 * @route   GET /admin/analytics/top-products
 * @desc    Get top selling products
 * @access  Admin, Staff
 */
router.get('/top-products', controller.getTopProducts);

/**
 * @route   GET /admin/analytics/order-status
 * @desc    Get order status distribution
 * @access  Admin, Staff
 */
router.get('/order-status', controller.getOrderStatusDistribution);

export default router;
