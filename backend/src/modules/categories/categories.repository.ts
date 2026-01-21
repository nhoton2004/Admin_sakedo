import { Category } from '@prisma/client';
import { prisma } from '../../config/database';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

/**
 * Repository for Category database operations
 */
export class CategoriesRepository {
    /**
     * Find all categories
     */
    public async findAll(): Promise<Category[]> {
        return prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    /**
     * Find category by ID
     */
    public async findById(id: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    }

    /**
     * Create category
     */
    public async create(dto: CreateCategoryDto): Promise<Category> {
        return prisma.category.create({
            data: dto,
        });
    }

    /**
     * Update category
     */
    public async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data: { isActive },
        });
    }

    /**
     * Soft delete (set isActive to false)
     */
    public async softDelete(id: string): Promise<Category> {
        return this.toggleActive(id, false);
    }
}
