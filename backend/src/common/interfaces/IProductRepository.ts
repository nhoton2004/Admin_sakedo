import { IProduct } from '../../models';
import { IRepository } from './IRepository';
import { ProductFilters, CreateProductDto, UpdateProductDto } from '../../modules/products/products.dto';

/**
 * Product Repository Interface
 * Extends base repository with product-specific operations
 */
export interface IProductRepository extends IRepository<IProduct> {
    /**
     * Find all products with filters
     */
    findAll(filters: ProductFilters): Promise<IProduct[]>;

    /**
     * Create product
     */
    create(dto: CreateProductDto): Promise<IProduct>;

    /**
     * Update product
     */
    update(id: string, dto: UpdateProductDto): Promise<IProduct | null>;

    /**
     * Toggle active status
     */
    toggleActive(id: string, isActive: boolean): Promise<IProduct | null>;

    /**
     * Toggle featured status
     */
    toggleFeatured(id: string, isFeatured: boolean): Promise<IProduct | null>;

    /**
     * Soft delete product
     */
    softDelete(id: string): Promise<IProduct | null>;
}
