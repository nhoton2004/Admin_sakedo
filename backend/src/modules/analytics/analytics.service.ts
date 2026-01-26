import { AnalyticsDto, DailyRevenueDto, TopProductDto, OrderStatusDistributionDto } from './analytics.dto';
import { AnalyticsRepository } from './analytics.repository';

/**
 * Service for analytics business logic
 */
export class AnalyticsService {
    private repository: AnalyticsRepository;

    constructor() {
        this.repository = new AnalyticsRepository();
    }

    /**
     * Get daily revenue for dashboard charts
     */
    public async getDailyRevenue(days: number): Promise<DailyRevenueDto[]> {
        return this.repository.getDailyRevenue(days);
    }

    /**
     * Get top selling products
     */
    public async getTopProducts(limit: number = 10): Promise<TopProductDto[]> {
        return this.repository.getTopProducts(limit);
    }

    /**
     * Get order status distribution for pie chart
     */
    public async getOrderStatusDistribution(): Promise<OrderStatusDistributionDto[]> {
        return this.repository.getOrderStatusDistribution();
    }

    /**
     * Get complete analytics data
     */
    public async getAnalytics(days: number): Promise<AnalyticsDto> {
        const [dailyRevenue, topProducts, orderStatusDistribution] = await Promise.all([
            this.repository.getDailyRevenue(days),
            this.repository.getTopProducts(10),
            this.repository.getOrderStatusDistribution(),
        ]);

        return {
            dailyRevenue,
            topProducts,
            orderStatusDistribution,
        };
    }
}
