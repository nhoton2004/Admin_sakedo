import { apiClient } from './apiClient';

export interface Product {
    id: string;
    _id?: string; // MongoDB ID field
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
    /**
     * Transform backend response to frontend format
     * Maps MongoDB _id to id for consistency
     */
    private static transformProduct(product: any): Product {
        return {
            ...product,
            id: product._id || product.id
        };
    }

    static async getAll(filters: ProductFilters = {}): Promise<Product[]> {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.categoryId) params.append('categoryId', filters.categoryId);
        if (filters.isActive !== undefined) params.append('isActive', String(filters.isActive));

        const response = await apiClient.get<any[]>(`/admin/products?${params.toString()}`);
        return response.data.map(ProductService.transformProduct);
    }

    static async create(dto: CreateProductDto): Promise<Product> {
        const response = await apiClient.post<any>('/admin/products', dto);
        return ProductService.transformProduct(response.data);
    }

    static async update(id: string, dto: UpdateProductDto): Promise<Product> {
        const response = await apiClient.put<any>(`/admin/products/${id}`, dto);
        return ProductService.transformProduct(response.data);
    }

    static async toggleActive(id: string): Promise<Product> {
        const response = await apiClient.patch<any>(`/admin/products/${id}/toggle-active`);
        return ProductService.transformProduct(response.data);
    }

    static async toggleFeatured(id: string): Promise<Product> {
        const response = await apiClient.patch<any>(`/admin/products/${id}/toggle-featured`);
        return ProductService.transformProduct(response.data);
    }

    static async delete(id: string): Promise<Product> {
        const response = await apiClient.delete<any>(`/admin/products/${id}`);
        return ProductService.transformProduct(response.data);
    }
}
