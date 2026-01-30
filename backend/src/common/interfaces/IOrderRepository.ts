import { IOrder } from '../../models';
import { IRepository } from './IRepository';
import { OrderFilters } from '../../modules/orders/orders.dto';
import { OrderStatus } from '../types/enums';

/**
 * Order Repository Interface
 * Extends base repository with order-specific operations
 */
export interface IOrderRepository extends IRepository<IOrder> {
    /**
     * Find all orders with filters
     */
    findAll(filters: OrderFilters): Promise<IOrder[]>;

    /**
     * Update order status
     */
    updateStatus(id: string, status: OrderStatus): Promise<IOrder | null>;

    /**
     * Assign driver to order
     */
    assignDriver(id: string, driverId: string): Promise<IOrder | null>;
}
