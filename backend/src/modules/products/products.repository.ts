import { Product, IProduct } from '../../models';
import { CreateProductDto, UpdateProductDto, ProductFilters } from './products.dto';
import { IProductRepository } from '../../common/interfaces';

/**
 * Repository for Product database operations
 */
export class ProductsRepository implements IProductRepository {
    /**
     * Find all products with optional filters
     */
    public async findAll(filters: ProductFilters): Promise<IProduct[]> {
        const query: any = {};

        if (filters.search) {
            query.$or = [
                { name: { $regex: filters.search, $options: 'i' } },
                { description: { $regex: filters.search, $options: 'i' } },
            ];
        }

        if (filters.categoryId) {
            query.categoryId = filters.categoryId;
        }

        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }

        return Product.find(query)
            .populate('categoryId')
            .sort({ createdAt: -1 })
            .exec();
    }

    /**
     * Find product by ID
     */
    public async findById(id: string): Promise<IProduct | null> {
        return Product.findById(id)
            .populate('categoryId')
            .exec();
    }

    /**
     * Create product
     */
    public async create(dto: CreateProductDto): Promise<IProduct> {
        const product = new Product(dto);
        await product.save();
        return Product.findById(product._id).populate('categoryId').exec() as Promise<IProduct>;
    }

    /**
     * Update product
     */
    public async update(id: string, dto: UpdateProductDto): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(
            id,
            dto,
            { new: true }
        ).populate('categoryId').exec();
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).exec();
    }

    /**
     * Toggle featured status
     */
    public async toggleFeatured(id: string, isFeatured: boolean): Promise<IProduct | null> {
        return Product.findByIdAndUpdate(
            id,
            { isFeatured },
            { new: true }
        ).exec();
    }

    /**
     * Soft delete
     */
    public async softDelete(id: string): Promise<IProduct | null> {
        return this.toggleActive(id, false);
    }
}
