/**
 * Order status breakdown interface
 */
export interface OrdersByStatusDto {
    pending: number;
    confirmed: number;
    preparing: number;
    ready: number;
    delivering: number;
    completed: number;
    canceled: number;
}

/**
 * Dashboard statistics DTO
 * Contains all real-time metrics for admin dashboard
 */
export interface DashboardStatsDto {
    // Total counts (all time)
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    totalReservations: number;

    // Today's metrics
    ordersToday: number;
    reservationsToday: number;
    revenueToday: number;

    // Order status breakdown
    ordersByStatus: OrdersByStatusDto;
}
