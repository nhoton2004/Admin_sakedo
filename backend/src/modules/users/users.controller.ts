import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { CreateUserSchema, UserFilters } from './users.dto';
import { UsersService } from './users.service';

/**
 * Controller for user management endpoints
 */
export class UsersController {
    private service: UsersService;

    constructor() {
        this.service = new UsersService();
    }

    /**
     * GET /admin/users
     */
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const filters: UserFilters = {
                role: req.query.role as string,
            };

            const users = await this.service.getAll(filters);
            res.json(users);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get users',
            });
        }
    };

    /**
     * POST /admin/users
     */
    public create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = CreateUserSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const user = await this.service.create(validation.data);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to create user',
            });
        }
    };

    /**
     * PATCH /admin/users/:id/toggle-active
     */
    public toggleActive = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const user = await this.service.toggleActive(req.params.id);
            res.json(user);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to toggle user status',
            });
        }
    };
}
