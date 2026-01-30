import { IProduct } from '../../models';
import { AppError } from '../../common/middleware/error.middleware';
import { CreateProductDto, UpdateProductDto, ProductFilters } from './products.dto';
import { ProductsRepository } from './products.repository';
import { BaseService } from '../../common/base';
import { IProductRepository } from '../../common/interfaces';

/**
 * Service for product business logic
 * Extends BaseService for CRUD operations (Inheritance)
 */
export class ProductsService extends BaseService<IProduct> {
    // Type-safe repository access
    protected repository: IProductRepository;

    constructor() {
        const repository = new ProductsRepository();
        super(repository);
        this.repository = repository;
    }

    protected get entityName(): string {
        return 'Product';
    }

    /**
     * Get all products with filters
     * Overrides base implementation for custom filters
     */
    public async getAll(filters: ProductFilters): Promise<IProduct[]> {
        return this.repository.findAll(filters);
    }

    /**
     * Create product
     */
    public async create(dto: CreateProductDto): Promise<IProduct> {
        return this.repository.create(dto);
    }

    /**
     * Update product
     */
    public async update(id: string, dto: UpdateProductDto): Promise<IProduct> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return (await this.repository.update(id, dto)) as IProduct;
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string): Promise<IProduct> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return (await this.repository.toggleActive(id, !product.isActive)) as IProduct;
    }

    /**
     * Toggle featured status
     */
    public async toggleFeatured(id: string): Promise<IProduct> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return (await this.repository.toggleFeatured(id, !product.isFeatured)) as IProduct;
    }

    /**
     * Soft delete product
     */
    public async delete(id: string): Promise<IProduct> {
        const product = await this.repository.findById(id);

        if (!product) {
            throw new AppError(404, 'Product not found');
        }

        return (await this.repository.softDelete(id)) as IProduct;
    }
}
