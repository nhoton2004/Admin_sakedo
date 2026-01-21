import { Order, OrderStatus } from '@prisma/client';
import { prisma } from '../../config/database';
import { OrderFilters } from './orders.dto';

/**
 * Repository for Order database operations
 */
export class OrdersRepository {
    /**
     * Find all orders with filters
     */
    public async findAll(filters: OrderFilters): Promise<Order[]> {
        const where: any = {};

        if (filters.status) {
            where.status = filters.status as OrderStatus;
        }

        return prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                assignedDriver: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Find order by ID
     */
    public async findById(id: string): Promise<Order | null> {
        return prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                assignedDriver: true,
            },
        });
    }

    /**
     * Update order status
     */
    public async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                assignedDriver: true,
            },
        });
    }

    /**
     * Assign driver to order
     */
    public async assignDriver(id: string, driverId: string): Promise<Order> {
        return prisma.order.update({
            where: { id },
            data: { assignedDriverId: driverId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
                assignedDriver: true,
            },
        });
    }
}
