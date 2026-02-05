import { apiClient } from './apiClient';

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    qty: number;
    price: number;
    product?: {
        id: string;
        name: string;
    };
}

export interface Order {
    id: string;
    customerId?: string;
    customerName: string;
    phone: string;
    address: string;
    note?: string;
    total: number;
    status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELED';
    assignedDriverId?: string | { id: string; name: string;[key: string]: any };
    createdAt: string;
    items?: OrderItem[];
    assignedDriver?: {
        id: string;
        name: string;
    };
}

export interface OrderFilters {
    status?: string;
}

export interface AssignDriverDto {
    driverId: string;
}

/**
 * Order API Service
 */
export class OrderService {
    static async getAll(filters: OrderFilters = {}): Promise<Order[]> {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);

        const response = await apiClient.get<Order[]>(`/admin/orders?${params.toString()}`);
        return response.data;
    }

    static async getById(id: string): Promise<Order> {
        const response = await apiClient.get<Order>(`/admin/orders/${id}`);
        return response.data;
    }

    static async confirm(id: string): Promise<Order> {
        const response = await apiClient.patch<Order>(`/admin/orders/${id}/confirm`);
        return response.data;
    }

    static async preparing(id: string): Promise<Order> {
        const response = await apiClient.patch<Order>(`/admin/orders/${id}/preparing`);
        return response.data;
    }

    static async ready(id: string): Promise<Order> {
        const response = await apiClient.patch<Order>(`/admin/orders/${id}/ready`);
        return response.data;
    }

    static async assignDriver(id: string, dto: AssignDriverDto): Promise<Order> {
        const response = await apiClient.patch<Order>(`/admin/orders/${id}/assign-driver`, dto);
        return response.data;
    }

    static async cancel(id: string): Promise<Order> {
        const response = await apiClient.patch<Order>(`/admin/orders/${id}/cancel`);
        return response.data;
    }

    static async getPendingCount(): Promise<number> {
        const response = await apiClient.get<{ count: number }>('/admin/orders/pending-count');
        return response.data.count;
    }
}
