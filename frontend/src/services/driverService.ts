import { apiClient } from './apiClient';
import { User } from './authService';

export interface CreateDriverDto {
    name: string;
    email: string;
    phone?: string;
    vehiclePlate?: string;
    area?: string;
    password?: string; // Optional if auto-generated
}

export interface DriverStats {
    totalDrivers: number;
    activeDrivers: number;
    totalEarnings: number;
}

/**
 * Driver API Service
 */
export class DriverService {
    static async getAll(): Promise<User[]> {
        const response = await apiClient.get<User[]>('/admin/drivers');
        return response.data;
    }

    static async create(dto: CreateDriverDto): Promise<User> {
        // Default password if not provided
        const payload = { ...dto, password: dto.password || '123456' };
        const response = await apiClient.post<User>('/admin/drivers', payload);
        return response.data;
    }

    static async update(id: string, data: Partial<User>): Promise<User> {
        const response = await apiClient.patch<User>(`/admin/drivers/${id}`, data);
        return response.data;
    }

    static async getStats(): Promise<DriverStats> {
        const response = await apiClient.get<DriverStats>('/admin/drivers/stats');
        return response.data;
    }

    static async toggleActive(id: string): Promise<User> {
        const response = await apiClient.patch<User>(`/admin/drivers/${id}/toggle-active`);
        return response.data;
    }

    static async delete(id: string): Promise<void> {
        await apiClient.delete(`/admin/drivers/${id}`);
    }
}
