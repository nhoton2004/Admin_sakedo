import { ICategory } from '../../models';
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
    public async getAll(): Promise<ICategory[]> {
        return this.repository.findAll();
    }

    /**
     * Create category
     */
    public async create(dto: CreateCategoryDto): Promise<ICategory> {
        return this.repository.create(dto);
    }

    /**
     * Update category
     */
    public async update(id: string, dto: UpdateCategoryDto): Promise<ICategory> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return (await this.repository.update(id, dto)) as ICategory;
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string): Promise<ICategory> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return (await this.repository.toggleActive(id, !category.isActive)) as ICategory;
    }

    /**
     * Soft delete category
     */
    public async delete(id: string): Promise<ICategory> {
        const category = await this.repository.findById(id);

        if (!category) {
            throw new AppError(404, 'Category not found');
        }

        return (await this.repository.softDelete(id)) as ICategory;
    }
}
