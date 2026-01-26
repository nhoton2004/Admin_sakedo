import { DashboardStatsDto } from './stats.dto';
import { StatsRepository } from './stats.repository';

/**
 * Service for dashboard stats business logic
 * Aggregates data from repository for dashboard display
 */
export class StatsService {
    private repository: StatsRepository;

    constructor() {
        this.repository = new StatsRepository();
    }

    /**
     * Get dashboard statistics
     * Returns real-time counts and metrics from database
     */
    public async getDashboardStats(): Promise<DashboardStatsDto> {
        // Fetch all data in parallel for performance
        const [
            totalCategories,
            totalProducts,
            totalOrders,
            totalReservations,
            ordersToday,
            reservationsToday,
            revenueToday,
            ordersByStatus,
        ] = await Promise.all([
            this.repository.getTotalCategories(),
            this.repository.getTotalProducts(),
            this.repository.getTotalOrders(),
            this.repository.getTotalReservations(),
            this.repository.getOrdersToday(),
            this.repository.getReservationsToday(),
            this.repository.getRevenueToday(),
            this.repository.getOrdersByStatus(),
        ]);

        return {
            totalCategories,
            totalProducts,
            totalOrders,
            totalReservations,
            ordersToday,
            reservationsToday,
            revenueToday,
            ordersByStatus,
        };
    }
}
