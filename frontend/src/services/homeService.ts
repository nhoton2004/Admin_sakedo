import { apiClient } from './apiClient';

export interface HomeVideo {
    id?: string;
    videoUrl: string;
    isActive: boolean;
    updatedAt?: string;
}

export interface UpdateVideoDto {
    videoUrl: string;
}

export const HomeService = {
    getVideo: async (): Promise<HomeVideo> => {
        const response = await apiClient.get('/admin/home/video');
        return response.data;
    },

    updateVideo: async (data: UpdateVideoDto): Promise<HomeVideo> => {
        const response = await apiClient.put('/admin/home/video', data);
        return response.data;
    },
};
