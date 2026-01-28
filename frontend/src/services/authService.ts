import { apiClient } from './apiClient';

export interface LoginDto {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    avatar?: string;
    phone?: string;
    vehiclePlate?: string;
    area?: string;
    driverStatus?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    rating?: number;
    totalOrders?: number;
    totalEarnings?: number;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

/**
 * Auth API Service
 */
export class AuthService {
    /**
     * Login
     */
    static async login(dto: LoginDto): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/admin/auth/login', dto);
        return response.data;
    }

    /**
     * Get current user
     */
    static async getCurrentUser(): Promise<User> {
        const response = await apiClient.get<User>('/admin/auth/me');
        return response.data;
    }
}
