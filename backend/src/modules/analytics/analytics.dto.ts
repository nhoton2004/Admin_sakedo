import { z } from 'zod';

/**
 * Query params for analytics endpoints
 */
export const AnalyticsQuerySchema = z.object({
    days: z.coerce.number().min(1).max(90).default(7),
});

export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;

/**
 * Daily revenue data point
 */
export interface DailyRevenueDto {
    date: string;
    revenue: number;
    orderCount: number;
}

/**
 * Daily orders data point
 */
export interface DailyOrdersDto {
    date: string;
    count: number;
}

/**
 * Top selling product
 */
export interface TopProductDto {
    id: string;
    name: string;
    imageUrl: string | null;
    totalQuantity: number;
    totalRevenue: number;
}

/**
 * Order status distribution
 */
export interface OrderStatusDistributionDto {
    status: string;
    count: number;
    percentage: number;
}

/**
 * Complete analytics response
 */
export interface AnalyticsDto {
    dailyRevenue: DailyRevenueDto[];
    topProducts: TopProductDto[];
    orderStatusDistribution: OrderStatusDistributionDto[];
}
