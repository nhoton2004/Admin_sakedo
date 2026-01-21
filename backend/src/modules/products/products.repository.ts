import { Product } from '@prisma/client';
import { prisma } from '../../config/database';
import { CreateProductDto, UpdateProductDto, ProductFilters } from './products.dto';

/**
 * Repository for Product database operations
 */
export class ProductsRepository {
    /**
     * Find all products with optional filters
     */
    public async findAll(filters: ProductFilters): Promise<Product[]> {
        const where: any = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search } },
                { description: { contains: filters.search } },
            ];
        }

        if (filters.categoryId) {
            where.categoryId = filters.categoryId;
        }

        if (filters.isActive !== undefined) {
            where.isActive = filters.isActive;
        }

        return prisma.product.findMany({
            where,
            include: {
                category: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Find product by ID
     */
    public async findById(id: string): Promise<Product | null> {
        return prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
    }

    /**
     * Create product
     */
    public async create(dto: CreateProductDto): Promise<Product> {
        return prisma.product.create({
            data: dto,
            include: {
                category: true,
            },
        });
    }

    /**
     * Update product
     */
    public async update(id: string, dto: UpdateProductDto): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: dto,
            include: {
                category: true,
            },
        });
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: { isActive },
        });
    }

    /**
     * Toggle featured status
     */
    public async toggleFeatured(id: string, isFeatured: boolean): Promise<Product> {
        return prisma.product.update({
            where: { id },
            data: { isFeatured },
        });
    }

    /**
     * Soft delete
     */
    public async softDelete(id: string): Promise<Product> {
        return this.toggleActive(id, false);
    }
}
