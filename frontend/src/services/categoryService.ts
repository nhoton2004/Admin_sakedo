import { apiClient } from './apiClient';

export interface Category {
    id: string;
    _id?: string; // MongoDB ID field
    name: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateCategoryDto {
    name: string;
}

export interface UpdateCategoryDto {
    name?: string;
    isActive?: boolean;
}

/**
 * Category API Service
 */
export class CategoryService {
    /**
     * Transform backend response to frontend format
     * Maps MongoDB _id to id for consistency
     */
    private static transformCategory(category: any): Category {
        return {
            ...category,
            id: category._id || category.id
        };
    }

    static async getAll(): Promise<Category[]> {
        const response = await apiClient.get<any[]>('/admin/categories');
        return response.data.map(CategoryService.transformCategory);
    }

    static async create(dto: CreateCategoryDto): Promise<Category> {
        const response = await apiClient.post<any>('/admin/categories', dto);
        return CategoryService.transformCategory(response.data);
    }

    static async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const response = await apiClient.put<any>(`/admin/categories/${id}`, dto);
        return CategoryService.transformCategory(response.data);
    }

    static async toggleActive(id: string): Promise<Category> {
        const response = await apiClient.patch<any>(`/admin/categories/${id}/toggle-active`);
        return CategoryService.transformCategory(response.data);
    }

    static async delete(id: string): Promise<void> {
        await apiClient.delete<void>(`/admin/categories/${id}`);
    }
}
