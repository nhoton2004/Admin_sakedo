import { Order, OrderStatus } from '@prisma/client';
import { AppError } from '../../common/middleware/error.middleware';
import { OrderFilters, AssignDriverDto } from './orders.dto';
import { OrdersRepository } from './orders.repository';
import { UsersRepository } from '../users/users.repository';
import { Role } from '../../common/enums';

/**
 * Service for order business logic
 */
export class OrdersService {
    private repository: OrdersRepository;
    private usersRepository: UsersRepository;

    constructor() {
        this.repository = new OrdersRepository();
        this.usersRepository = new UsersRepository();
    }

    /**
     * Get all orders with filters
     */
    public async getAll(filters: OrderFilters): Promise<Order[]> {
        return this.repository.findAll(filters);
    }

    /**
     * Get order by ID
     */
    public async getById(id: string): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        return order;
    }

    /**
     * Confirm order
     * Business rule: Only PENDING orders can be confirmed
     */
    public async confirm(id: string): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        if (order.status !== OrderStatus.PENDING) {
            throw new AppError(400, 'Only PENDING orders can be confirmed');
        }

        return this.repository.updateStatus(id, OrderStatus.CONFIRMED);
    }

    /**
     * Set order to preparing
     * Business rule: Only CONFIRMED orders can be set to preparing
     */
    public async preparing(id: string): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        if (order.status !== OrderStatus.CONFIRMED) {
            throw new AppError(400, 'Only CONFIRMED orders can be set to preparing');
        }

        return this.repository.updateStatus(id, OrderStatus.PREPARING);
    }

    /**
     * Set order to ready
     * Business rule: Only PREPARING orders can be set to ready
     */
    public async ready(id: string): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        if (order.status !== OrderStatus.PREPARING) {
            throw new AppError(400, 'Only PREPARING orders can be set to ready');
        }

        return this.repository.updateStatus(id, OrderStatus.READY);
    }

    /**
     * Assign driver to order
     * Business rule: Only READY orders can have driver assigned
     */
    public async assignDriver(id: string, dto: AssignDriverDto): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        if (order.status !== OrderStatus.READY) {
            throw new AppError(400, 'Only READY orders can have driver assigned');
        }

        // Verify driver exists and is active
        const driver = await this.usersRepository.findById(dto.driverId);

        if (!driver || driver.role !== Role.DRIVER) {
            throw new AppError(400, 'Invalid driver');
        }

        if (!driver.isActive) {
            throw new AppError(400, 'Driver is not active');
        }

        const updatedOrder = await this.repository.assignDriver(id, dto.driverId);

        // Automatically set status to DELIVERING after driver assignment
        return this.repository.updateStatus(id, OrderStatus.DELIVERING);
    }

    /**
     * Cancel order
     * Business rule: Only orders before COMPLETED can be canceled
     */
    public async cancel(id: string): Promise<Order> {
        const order = await this.repository.findById(id);

        if (!order) {
            throw new AppError(404, 'Order not found');
        }

        if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELED) {
            throw new AppError(400, 'Cannot cancel completed or already canceled orders');
        }

        return this.repository.updateStatus(id, OrderStatus.CANCELED);
    }
}
