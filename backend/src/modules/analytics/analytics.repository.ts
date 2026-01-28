import { Order } from '../../models';
import { DailyRevenueDto, TopProductDto, OrderStatusDistributionDto } from './analytics.dto';

/**
 * Repository for analytics data access
 * Uses MongoDB aggregation pipeline for complex aggregations
 */
export class AnalyticsRepository {
    /**
     * Get daily revenue for the last N days
     */
    public async getDailyRevenue(days: number): Promise<DailyRevenueDto[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        // Get orders grouped by date
        const orders = await Order.find({
            createdAt: { $gte: startDate },
            status: 'COMPLETED',
        }).select('createdAt total').exec();

        // Group by date manually
        const dailyMap = new Map<string, { revenue: number; count: number }>();

        // Initialize all days with 0
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyMap.set(dateStr, { revenue: 0, count: 0 });
        }

        // Aggregate order data
        orders.forEach(order => {
            const dateStr = order.createdAt.toISOString().split('T')[0];
            const existing = dailyMap.get(dateStr) || { revenue: 0, count: 0 };
            dailyMap.set(dateStr, {
                revenue: existing.revenue + order.total,
                count: existing.count + 1,
            });
        });

        // Convert to array and sort by date ascending
        return Array.from(dailyMap.entries())
            .map(([date, data]) => ({
                date,
                revenue: data.revenue,
                orderCount: data.count,
            }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }

    /**
     * Get top selling products
     */
    public async getTopProducts(limit: number = 10): Promise<TopProductDto[]> {
        // Use aggregation to group order items by product
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantity: { $sum: '$items.qty' },
                    totalRevenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
                },
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: limit },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
            { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: '$_id',
                    name: { $ifNull: ['$product.name', 'Unknown'] },
                    imageUrl: '$product.imageUrl',
                    totalQuantity: 1,
                    totalRevenue: 1,
                },
            },
        ]).exec();

        return topProducts;
    }

    /**
     * Get order status distribution
     */
    public async getOrderStatusDistribution(): Promise<OrderStatusDistributionDto[]> {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELED'];

        const counts = await Promise.all(
            statuses.map(status =>
                Order.countDocuments({ status }).exec()
            )
        );

        const total = counts.reduce((sum, count) => sum + count, 0);

        return statuses.map((status, index) => ({
            status,
            count: counts[index],
            percentage: total > 0 ? Math.round((counts[index] / total) * 100) : 0,
        }));
    }
}
