import { apiClient } from './apiClient';

export interface KpiData {
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    totalReservations: number;
    categoriesChange: number;
    productsChange: number;
    ordersChange: number;
    reservationsChange: number;
}

export interface DailyRevenue {
    date: string;
    revenue: number;
    orders: number;
}

export interface TopProduct {
    productId: string;
    name: string;
    totalSold: number;
    revenue: number;
}

export interface OrderStatusData {
    status: string;
    count: number;
}

export interface AnalyticsData {
    kpis: KpiData;
    dailyRevenue: DailyRevenue[];
    topProducts: TopProduct[];
    orderStatus: OrderStatusData[];
}

/**
 * Analytics API Service
 */
export class AnalyticsService {
    /**
     * Get complete analytics data
     */
    static async getAnalytics(days: number = 30): Promise<AnalyticsData> {
        const response = await apiClient.get<AnalyticsData>(`/admin/analytics?days=${days}`);
        return response.data;
    }

    /**
     * Get daily revenue data
     */
    static async getDailyRevenue(days: number = 7): Promise<DailyRevenue[]> {
        const response = await apiClient.get<DailyRevenue[]>(`/admin/analytics/revenue?days=${days}`);
        return response.data;
    }

    /**
     * Get top selling products
     */
    static async getTopProducts(limit: number = 10): Promise<TopProduct[]> {
        const response = await apiClient.get<TopProduct[]>(`/admin/analytics/top-products?limit=${limit}`);
        return response.data;
    }

    /**
     * Get order status distribution
     */
    static async getOrderStatusDistribution(): Promise<OrderStatusData[]> {
        const response = await apiClient.get<OrderStatusData[]>(`/admin/analytics/order-status`);
        return response.data;
    }
}
