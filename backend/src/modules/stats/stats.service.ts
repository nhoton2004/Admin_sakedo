import { DashboardStatsDto } from './stats.dto';
import { StatsRepository } from './stats.repository';

/**
 * Service for dashboard stats business logic
 */
export class StatsService {
    private repository: StatsRepository;

    constructor() {
        this.repository = new StatsRepository();
    }

    /**
     * Get dashboard statistics
     * Returns real-time counts from database
     */
    public async getDashboardStats(): Promise<DashboardStatsDto> {
        const [totalCategories, totalProducts, totalOrders, totalReservations] = await Promise.all([
            this.repository.getTotalCategories(),
            this.repository.getTotalProducts(),
            this.repository.getTotalOrders(),
            this.repository.getTotalReservations(),
        ]);

        return {
            totalCategories,
            totalProducts,
            totalOrders,
            totalReservations,
        };
    }
}
