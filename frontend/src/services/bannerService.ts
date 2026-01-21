import { apiClient } from './apiClient';

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBannerDto {
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    order?: number;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> { }

export interface ReorderItem {
    id: string;
    order: number;
}

export const BannerService = {
    getAll: async (): Promise<Banner[]> => {
        const response = await apiClient.get('/admin/banners');
        return response.data;
    },

    getById: async (id: string): Promise<Banner> => {
        const response = await apiClient.get(`/admin/banners/${id}`);
        return response.data;
    },

    create: async (data: CreateBannerDto): Promise<Banner> => {
        const response = await apiClient.post('/admin/banners', data);
        return response.data;
    },

    update: async (id: string, data: UpdateBannerDto): Promise<Banner> => {
        const response = await apiClient.put(`/admin/banners/${id}`, data);
        return response.data;
    },

    toggleActive: async (id: string): Promise<Banner> => {
        const response = await apiClient.patch(`/admin/banners/${id}/toggle-active`);
        return response.data;
    },

    reorder: async (items: ReorderItem[]): Promise<{ message: string }> => {
        const response = await apiClient.patch('/admin/banners/reorder', items);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/banners/${id}`);
    },
};
