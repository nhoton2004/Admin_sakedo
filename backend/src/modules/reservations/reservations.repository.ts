import { Reservation, ReservationStatus } from '@prisma/client';
import { prisma } from '../../config/database';
import { ReservationFilters } from './reservations.dto';

/**
 * Repository for Reservation database operations
 */
export class ReservationsRepository {
    /**
     * Find all reservations with filters
     */
    public async findAll(filters: ReservationFilters): Promise<Reservation[]> {
        const where: any = {};

        if (filters.date) {
            const startDate = new Date(filters.date);
            const endDate = new Date(filters.date);
            endDate.setDate(endDate.getDate() + 1);

            where.datetime = {
                gte: startDate,
                lt: endDate,
            };
        }

        if (filters.status) {
            where.status = filters.status as ReservationStatus;
        }

        return prisma.reservation.findMany({
            where,
            orderBy: { datetime: 'desc' },
        });
    }

    /**
     * Find reservation by ID
     */
    public async findById(id: string): Promise<Reservation | null> {
        return prisma.reservation.findUnique({
            where: { id },
        });
    }

    /**
     * Update reservation status
     */
    public async updateStatus(id: string, status: ReservationStatus): Promise<Reservation> {
        return prisma.reservation.update({
            where: { id },
            data: { status },
        });
    }
}
