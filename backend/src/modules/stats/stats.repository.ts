import { prisma } from '../../config/database';
import { OrdersByStatusDto } from './stats.dto';

/**
 * Repository for stats data access
 * All methods query real data from database
 */
export class StatsRepository {
    /**
     * Get start of today (midnight) for date filtering
     */
    private getStartOfToday(): Date {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today;
    }

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
     * Get total count of orders (all time)
     */
    public async getTotalOrders(): Promise<number> {
        return prisma.order.count();
    }

    /**
     * Get total count of reservations (all time)
     */
    public async getTotalReservations(): Promise<number> {
        return prisma.reservation.count();
    }

    /**
     * Get count of orders created today
     */
    public async getOrdersToday(): Promise<number> {
        return prisma.order.count({
            where: {
                createdAt: {
                    gte: this.getStartOfToday(),
                },
            },
        });
    }

    /**
     * Get count of reservations for today
     */
    public async getReservationsToday(): Promise<number> {
        const startOfToday = this.getStartOfToday();
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        return prisma.reservation.count({
            where: {
                datetime: {
                    gte: startOfToday,
                    lt: endOfToday,
                },
            },
        });
    }

    /**
     * Get total revenue from orders today
     * Only counts COMPLETED orders
     */
    public async getRevenueToday(): Promise<number> {
        const result = await prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                createdAt: {
                    gte: this.getStartOfToday(),
                },
                status: 'COMPLETED',
            },
        });

        return result._sum.total || 0;
    }

    /**
     * Get order count grouped by status
     */
    public async getOrdersByStatus(): Promise<OrdersByStatusDto> {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELED'];

        const counts = await Promise.all(
            statuses.map(status =>
                prisma.order.count({
                    where: { status },
                })
            )
        );

        return {
            pending: counts[0],
            confirmed: counts[1],
            preparing: counts[2],
            ready: counts[3],
            delivering: counts[4],
            completed: counts[5],
            canceled: counts[6],
        };
    }
}
