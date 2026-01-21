import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { OrderFilters, AssignDriverSchema } from './orders.dto';
import { OrdersService } from './orders.service';

/**
 * Controller for order endpoints
 */
export class OrdersController {
    private service: OrdersService;

    constructor() {
        this.service = new OrdersService();
    }

    /**
     * GET /admin/orders
     */
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const filters: OrderFilters = {
                status: req.query.status as string,
            };

            const orders = await this.service.getAll(filters);
            res.json(orders);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get orders',
            });
        }
    };

    /**
     * GET /admin/orders/:id
     */
    public getById = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.service.getById(req.params.id);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get order',
            });
        }
    };

    /**
     * PATCH /admin/orders/:id/confirm
     */
    public confirm = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.service.confirm(req.params.id);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to confirm order',
            });
        }
    };

    /**
     * PATCH /admin/orders/:id/preparing
     */
    public preparing = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.service.preparing(req.params.id);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to set order to preparing',
            });
        }
    };

    /**
     * PATCH /admin/orders/:id/ready
     */
    public ready = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.service.ready(req.params.id);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to set order to ready',
            });
        }
    };

    /**
     * PATCH /admin/orders/:id/assign-driver
     */
    public assignDriver = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = AssignDriverSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const order = await this.service.assignDriver(req.params.id, validation.data);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to assign driver',
            });
        }
    };

    /**
     * PATCH /admin/orders/:id/cancel
     */
    public cancel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const order = await this.service.cancel(req.params.id);
            res.json(order);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to cancel order',
            });
        }
    };
}
