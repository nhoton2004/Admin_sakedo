import { apiClient } from './apiClient';
import { User } from './authService';

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: 'DRIVER';
}

export interface UserFilters {
    role?: string;
}

/**
 * User API Service
 */
export class UserService {
    static async getAll(filters: UserFilters = {}): Promise<User[]> {
        const params = new URLSearchParams();
        if (filters.role) params.append('role', filters.role);

        const response = await apiClient.get<User[]>(`/admin/users?${params.toString()}`);
        return response.data;
    }

    static async create(dto: CreateUserDto): Promise<User> {
        const response = await apiClient.post<User>('/admin/users', dto);
        return response.data;
    }

    static async toggleActive(id: string): Promise<User> {
        const response = await apiClient.patch<User>(`/admin/users/${id}/toggle-active`);
        return response.data;
    }
}
