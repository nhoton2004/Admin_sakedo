import { apiClient } from './apiClient';

export interface Category {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateCategoryDto {
    name: string;
}

export interface UpdateCategoryDto {
    name: string;
}

/**
 * Category API Service
 */
export class CategoryService {
    static async getAll(): Promise<Category[]> {
        const response = await apiClient.get<Category[]>('/admin/categories');
        return response.data;
    }

    static async create(dto: CreateCategoryDto): Promise<Category> {
        const response = await apiClient.post<Category>('/admin/categories', dto);
        return response.data;
    }

    static async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
        const response = await apiClient.put<Category>(`/admin/categories/${id}`, dto);
        return response.data;
    }

    static async toggleActive(id: string): Promise<Category> {
        const response = await apiClient.patch<Category>(`/admin/categories/${id}/toggle-active`);
        return response.data;
    }

    static async delete(id: string): Promise<Category> {
        const response = await apiClient.delete<Category>(`/admin/categories/${id}`);
        return response.data;
    }
}
