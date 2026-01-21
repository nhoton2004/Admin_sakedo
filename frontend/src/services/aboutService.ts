import { apiClient } from './apiClient';

export interface AboutSection {
    id?: string;
    heading: string;
    content: string;
    imageUrl?: string;
    updatedAt?: string;
}

export interface UpdateAboutDto {
    heading: string;
    content: string;
    imageUrl?: string;
}

export const AboutService = {
    get: async (): Promise<AboutSection> => {
        const response = await apiClient.get('/admin/about');
        return response.data;
    },

    update: async (data: UpdateAboutDto): Promise<AboutSection> => {
        const response = await apiClient.put('/admin/about', data);
        return response.data;
    },
};
