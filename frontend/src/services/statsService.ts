import { apiClient } from './apiClient';

export interface DashboardStats {
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    totalReservations: number;
}

/**
 * Service for stats API calls
 */
class StatsServiceClass {
    /**
     * Get dashboard statistics
     * @returns Real-time stats from database
     */
    async getDashboardStats(): Promise<DashboardStats> {
        const response = await apiClient.get<DashboardStats>('/admin/stats');
        return response.data;
    }
}

export const StatsService = new StatsServiceClass();
