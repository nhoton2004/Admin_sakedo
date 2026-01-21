import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { CreateProductSchema, UpdateProductSchema, ProductFilters } from './products.dto';
import { ProductsService } from './products.service';

/**
 * Controller for product endpoints
 */
export class ProductsController {
    private service: ProductsService;

    constructor() {
        this.service = new ProductsService();
    }

    /**
     * GET /admin/products
     */
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const filters: ProductFilters = {
                search: req.query.search as string,
                categoryId: req.query.categoryId as string,
                isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
            };

            const products = await this.service.getAll(filters);
            res.json(products);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get products',
            });
        }
    };

    /**
     * POST /admin/products
     */
    public create = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = CreateProductSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const product = await this.service.create(validation.data);
            res.status(201).json(product);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to create product',
            });
        }
    };

    /**
     * PUT /admin/products/:id
     */
    public update = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const validation = UpdateProductSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const product = await this.service.update(req.params.id, validation.data);
            res.json(product);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to update product',
            });
        }
    };

    /**
     * PATCH /admin/products/:id/toggle-active
     */
    public toggleActive = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const product = await this.service.toggleActive(req.params.id);
            res.json(product);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to toggle product status',
            });
        }
    };

    /**
     * PATCH /admin/products/:id/toggle-featured
     */
    public toggleFeatured = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const product = await this.service.toggleFeatured(req.params.id);
            res.json(product);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to toggle featured status',
            });
        }
    };

    /**
     * DELETE /admin/products/:id
     */
    public delete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const product = await this.service.delete(req.params.id);
            res.json(product);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to delete product',
            });
        }
    };
}
