import { Reservation, ReservationStatus } from '@prisma/client';
import { AppError } from '../../common/middleware/error.middleware';
import { ReservationFilters } from './reservations.dto';
import { ReservationsRepository } from './reservations.repository';

/**
 * Service for reservation business logic
 */
export class ReservationsService {
    private repository: ReservationsRepository;

    constructor() {
        this.repository = new ReservationsRepository();
    }

    /**
     * Get all reservations with filters
     */
    public async getAll(filters: ReservationFilters): Promise<Reservation[]> {
        return this.repository.findAll(filters);
    }

    /**
     * Confirm reservation
     * Business rule: Only NEW reservations can be confirmed
     */
    public async confirm(id: string): Promise<Reservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (reservation.status !== ReservationStatus.NEW) {
            throw new AppError(400, 'Only NEW reservations can be confirmed');
        }

        return this.repository.updateStatus(id, ReservationStatus.CONFIRMED);
    }

    /**
     * Cancel reservation
     * Business rule: Only NEW or CONFIRMED reservations can be canceled
     */
    public async cancel(id: string): Promise<Reservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (![ReservationStatus.NEW, ReservationStatus.CONFIRMED].includes(reservation.status)) {
            throw new AppError(400, 'Only NEW or CONFIRMED reservations can be canceled');
        }

        return this.repository.updateStatus(id, ReservationStatus.CANCELED);
    }

    /**
     * Complete reservation
     * Business rule: Only CONFIRMED reservations can be completed
     */
    public async complete(id: string): Promise<Reservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (reservation.status !== ReservationStatus.CONFIRMED) {
            throw new AppError(400, 'Only CONFIRMED reservations can be completed');
        }

        return this.repository.updateStatus(id, ReservationStatus.COMPLETED);
    }
}
