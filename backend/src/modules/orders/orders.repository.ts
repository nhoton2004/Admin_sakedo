import { Order, IOrder } from '../../models';
import { OrderFilters } from './orders.dto';

/**
 * Repository for Order database operations
 */
export class OrdersRepository {
    /**
     * Find all orders with filters
     */
    public async findAll(filters: OrderFilters): Promise<IOrder[]> {
        const query: any = {};

        if (filters.status) {
            query.status = filters.status;
        }

        return Order.find(query)
            .populate('customerId')
            .populate('assignedDriverId')
            .populate('items.productId')
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find order by ID
     */
    public async findById(id: string): Promise<IOrder | null> {
        return Order.findById(id)
            .populate('customerId')
            .populate('assignedDriverId')
            .populate('items.productId')
            .exec();
    }

    /**
     * Update order status
     */
    public async updateStatus(id: string, status: string): Promise<IOrder | null> {
        return Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        )
            .populate('customerId')
            .populate('assignedDriverId')
            .populate('items.productId')
            .exec();
    }

    /**
     * Assign driver to order
     */
    public async assignDriver(id: string, driverId: string): Promise<IOrder | null> {
        return Order.findByIdAndUpdate(
            id,
            { assignedDriverId: driverId },
            { new: true }
        )
            .populate('customerId')
            .populate('assignedDriverId')
            .populate('items.productId')
            .exec();
    }
}
