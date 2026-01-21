import { Product } from '@prisma/client';
import { AppError } from '../../common/middleware/error.middleware';
import { CreateProductDto, UpdateProductDto, ProductFilters } from './products.dto';
import { ProductsRepository } from './products.repository';

/**
 * Service for product business logic
 */
export class ProductsService {
    private repository: ProductsRepository;

    constructor() {
        this.repository = new ProductsRepository();
    }

    /**
     * Get all products with filters
     */
    public async getAll(filters: ProductFilters): Promise<Product[]> {
        return this.repository.findAll(filters);
    }

    /**
     * Create product
     */
    public async create(dto: CreateProductDto): Promise<Product> {
        return this.repository.create(dto);
    }

    /**
     * Update product
     */
    public async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return this.repository.update(id, dto);
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string): Promise<Product> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return this.repository.toggleActive(id, !product.isActive);
    }

    /**
     * Toggle featured status
     */
    public async toggleFeatured(id: string): Promise<Product> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return this.repository.toggleFeatured(id, !product.isFeatured);
    }

    /**
     * Soft delete product
     */
    public async delete(id: string): Promise<Product> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return this.repository.softDelete(id);
    }
}
