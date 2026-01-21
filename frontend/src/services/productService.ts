import { apiClient } from './apiClient';

export interface Product {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isActive: boolean;
    isFeatured: boolean;
    createdAt: string;
    category?: {
        id: string;
        name: string;
    };
}

export interface CreateProductDto {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isFeatured?: boolean;
}

export interface UpdateProductDto {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isFeatured?: boolean;
}

export interface ProductFilters {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
}

/**
 * Product API Service
 */
export class ProductService {
    static async getAll(filters: ProductFilters = {}): Promise<Product[]> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

        const response = await apiClient.get<Product[]>(`/admin/products?${params.toString()}`);
        return response.data;
    }

    static async create(dto: CreateProductDto): Promise<Product> {
        const response = await apiClient.post<Product>('/admin/products', dto);
        return response.data;
    }

    static async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const response = await apiClient.put<Product>(`/admin/products/${id}`, dto);
        return response.data;
    }

    static async toggleActive(id: string): Promise<Product> {
        const response = await apiClient.patch<Product>(`/admin/products/${id}/toggle-active`);
        return response.data;
    }

    static async toggleFeatured(id: string): Promise<Product> {
        const response = await apiClient.patch<Product>(`/admin/products/${id}/toggle-featured`);
        return response.data;
    }

    static async delete(id: string): Promise<Product> {
        const response = await apiClient.delete<Product>(`/admin/products/${id}`);
        return response.data;
    }
}
