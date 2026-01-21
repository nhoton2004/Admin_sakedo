import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { StatsService } from './stats.service';

/**
 * Controller for stats endpoints
 */
export class StatsController {
    private service: StatsService;

    constructor() {
        this.service = new StatsService();
    }

    /**
     * GET /admin/stats
     * Returns dashboard statistics
     */
    public getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const stats = await this.service.getDashboardStats();
            res.json(stats);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to fetch dashboard stats',
                details: error.details,
            });
        }
    };
}
