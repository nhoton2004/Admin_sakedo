import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { CreateCategorySchema, UpdateCategorySchema } from './categories.dto';
import { CategoriesService } from './categories.service';

/**
 * Controller for category endpoints
 */
export class CategoriesController {
    private service: CategoriesService;

    constructor() {
        this.service = new CategoriesService();
    }

    /**
     * GET /admin/categories
     */
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const categories = await this.service.getAll();
            res.json(categories);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get categories',
            });
        }
    };

    /**
     * POST /admin/categories
     */
    public create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = CreateCategorySchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const category = await this.service.create(validation.data);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to create category',
            });
        }
    };

    /**
     * PUT /admin/categories/:id
     */
    public update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = UpdateCategorySchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const category = await this.service.update(req.params.id, validation.data);
            res.json(category);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to update category',
            });
        }
    };

    /**
     * PATCH /admin/categories/:id/toggle-active
     */
    public toggleActive = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const category = await this.service.toggleActive(req.params.id);
            res.json(category);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to toggle category status',
            });
        }
    };

    /**
     * DELETE /admin/categories/:id
     */
    public delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const category = await this.service.delete(req.params.id);
            res.json(category);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to delete category',
            });
        }
    };
}
