import { Category, ICategory } from '../../models';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

/**
 * Repository for Category database operations
 */
export class CategoriesRepository {
    /**
     * Find all categories
     */
    public async findAll(): Promise<ICategory[]> {
        return Category.find().sort({ createdAt: -1 }).exec();
    }

    /**
     * Find category by ID
     */
    public async findById(id: string): Promise<ICategory | null> {
        return Category.findById(id).exec();
    }

    /**
     * Create category
     */
    public async create(dto: CreateCategoryDto): Promise<ICategory> {
        const category = new Category(dto);
        return category.save();
    }

    /**
     * Update category
     */
    public async update(id: string, dto: UpdateCategoryDto): Promise<ICategory | null> {
        return Category.findByIdAndUpdate(
            id,
            dto,
            { new: true }
        ).exec();
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<ICategory | null> {
        return Category.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).exec();
    }

    /**
     * Soft delete (set isActive to false)
     */
    public async softDelete(id: string): Promise<ICategory | null> {
        return this.toggleActive(id, false);
    }
}
