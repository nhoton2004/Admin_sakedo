import { prisma } from '../../config/database';
import { DailyRevenueDto, TopProductDto, OrderStatusDistributionDto } from './analytics.dto';

/**
 * Repository for analytics data access
 * Uses raw SQL queries for complex aggregations
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
        const orders = await prisma.order.findMany({
            where: {
                createdAt: { gte: startDate },
                status: 'COMPLETED',
            },
            select: {
                createdAt: true,
                total: true,
            },
        });

        // Group by date manually (SQLite doesn't support DATE() function well with Prisma)
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
        // Get order items with product info
        const orderItems = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                qty: true,
                price: true,
            },
            orderBy: {
                _sum: {
                    qty: 'desc',
                },
            },
            take: limit,
        });

        // Get product details
        const productIds = orderItems.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: {
                id: true,
                name: true,
                imageUrl: true,
            },
        });

        const productMap = new Map(products.map(p => [p.id, p]));

        return orderItems.map(item => {
            const product = productMap.get(item.productId);
            return {
                id: item.productId,
                name: product?.name || 'Unknown',
                imageUrl: product?.imageUrl || null,
                totalQuantity: item._sum.qty || 0,
                totalRevenue: item._sum.price || 0,
            };
        });
    }

    /**
     * Get order status distribution
     */
    public async getOrderStatusDistribution(): Promise<OrderStatusDistributionDto[]> {
        const statuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELED'];

        const counts = await Promise.all(
            statuses.map(status =>
                prisma.order.count({ where: { status } })
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
