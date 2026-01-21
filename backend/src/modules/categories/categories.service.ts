import { Category } from '@prisma/client';
import { AppError } from '../../common/middleware/error.middleware';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';

/**
 * Service for category business logic
 */
export class CategoriesService {
    private repository: CategoriesRepository;

    constructor() {
        this.repository = new CategoriesRepository();
    }

    /**
     * Get all categories
     */
    public async getAll(): Promise<Category[]> {
        return this.repository.findAll();
    }

    /**
     * Create category
     */
    public async create(dto: CreateCategoryDto): Promise<Category> {
        return this.repository.create(dto);
    }

    /**
     * Update category
     */
    public async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return this.repository.update(id, dto);
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string): Promise<Category> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return this.repository.toggleActive(id, !category.isActive);
    }

    /**
     * Soft delete category
     */
    public async delete(id: string): Promise<Category> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return this.repository.softDelete(id);
    }
}
