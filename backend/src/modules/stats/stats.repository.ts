import { prisma } from '../../config/database';

/**
 * Repository for stats data access
 */
export class StatsRepository {
    /**
     * Get total count of categories
     */
    public async getTotalCategories(): Promise<number> {
        return prisma.category.count();
    }

    /**
     * Get total count of products
     */
    public async getTotalProducts(): Promise<number> {
        return prisma.product.count();
    }

    /**
     * Get total count of orders
     */
    public async getTotalOrders(): Promise<number> {
        return prisma.order.count();
    }

    /**
     * Get total count of reservations
     */
    public async getTotalReservations(): Promise<number> {
        return prisma.reservation.count();
    }
}
