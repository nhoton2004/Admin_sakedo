import { Category, Product, Order, Reservation } from '../../models';
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
        return Category.countDocuments().exec();
    }

    /**
     * Get total count of products
     */
    public async getTotalProducts(): Promise<number> {
        return Product.countDocuments().exec();
    }

    /**
     * Get total count of orders (all time)
     */
    public async getTotalOrders(): Promise<number> {
        return Order.countDocuments().exec();
    }

    /**
     * Get total count of reservations (all time)
     */
    public async getTotalReservations(): Promise<number> {
        return Reservation.countDocuments().exec();
    }

    /**
     * Get count of orders created today
     */
    public async getOrdersToday(): Promise<number> {
        return Order.countDocuments({
            createdAt: {
                $gte: this.getStartOfToday(),
            },
        }).exec();
    }

    /**
     * Get count of reservations for today
     */
    public async getReservationsToday(): Promise<number> {
        const startOfToday = this.getStartOfToday();
        const endOfToday = new Date(startOfToday);
        endOfToday.setDate(endOfToday.getDate() + 1);

        return Reservation.countDocuments({
            datetime: {
                $gte: startOfToday,
                $lt: endOfToday,
            },
        }).exec();
    }

    /**
     * Get total revenue from orders today
     * Only counts COMPLETED orders
     */
    public async getRevenueToday(): Promise<number> {
        const result = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: this.getStartOfToday() },
                    status: 'COMPLETED',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                },
            },
        ]).exec();

        return result.length > 0 ? result[0].total : 0;
    }

    /**
     * Get order count grouped by status
     */
    public async getOrdersByStatus(): Promise<OrdersByStatusDto> {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELED'];

        const counts = await Promise.all(
            statuses.map(status =>
                Order.countDocuments({ status }).exec()
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
