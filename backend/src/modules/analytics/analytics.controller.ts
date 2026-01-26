import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { AnalyticsQuerySchema } from './analytics.dto';
import { AnalyticsService } from './analytics.service';

/**
 * Controller for analytics endpoints
 */
export class AnalyticsController {
    private service: AnalyticsService;

    constructor() {
        this.service = new AnalyticsService();
    }

    /**
     * GET /admin/analytics
     * Get complete analytics data
     */
    public getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const query = AnalyticsQuerySchema.parse(req.query);
            const analytics = await this.service.getAnalytics(query.days);
            res.json(analytics);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get analytics',
            });
        }
    };

    /**
     * GET /admin/analytics/revenue
     * Get daily revenue data
     */
    public getDailyRevenue = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const query = AnalyticsQuerySchema.parse(req.query);
            const data = await this.service.getDailyRevenue(query.days);
            res.json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get revenue data',
            });
        }
    };

    /**
     * GET /admin/analytics/top-products
     * Get top selling products
     */
    public getTopProducts = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const data = await this.service.getTopProducts(limit);
            res.json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get top products',
            });
        }
    };

    /**
     * GET /admin/analytics/order-status
     * Get order status distribution
     */
    public getOrderStatusDistribution = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const data = await this.service.getOrderStatusDistribution();
            res.json(data);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get order status distribution',
            });
        }
    };
}
