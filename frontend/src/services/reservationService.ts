import { apiClient } from './apiClient';

export interface Reservation {
    id: string;
    customerName: string;
    phone: string;
    datetime: string;
    guests: number;
    note?: string;
    status: 'NEW' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
    createdAt: string;
}

export interface ReservationFilters {
    date?: string;
    status?: string;
}

/**
 * Reservation API Service
 */
export class ReservationService {
    static async getAll(filters: ReservationFilters = {}): Promise<Reservation[]> {
        const params = new URLSearchParams();
        if (filters.date) params.append('date', filters.date);
        if (filters.status) params.append('status', filters.status);

        const response = await apiClient.get<Reservation[]>(`/admin/reservations?${params.toString()}`);
        return response.data;
    }

    static async confirm(id: string): Promise<Reservation> {
        const response = await apiClient.patch<Reservation>(`/admin/reservations/${id}/confirm`);
        return response.data;
    }

    static async cancel(id: string): Promise<Reservation> {
        const response = await apiClient.patch<Reservation>(`/admin/reservations/${id}/cancel`);
        return response.data;
    }

    static async complete(id: string): Promise<Reservation> {
        const response = await apiClient.patch<Reservation>(`/admin/reservations/${id}/complete`);
        return response.data;
    }
}
