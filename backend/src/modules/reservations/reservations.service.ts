import { IReservation } from '../../models';
import { AppError } from '../../common/middleware/error.middleware';
import { ReservationFilters } from './reservations.dto';
import { ReservationsRepository } from './reservations.repository';
import { ReservationStatus } from '../../common/types/enums';

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
    public async getAll(filters: ReservationFilters): Promise<IReservation[]> {
        return this.repository.findAll(filters);
    }

    /**
     * Confirm reservation
     * Business rule: Only NEW reservations can be confirmed
     */
    public async confirm(id: string): Promise<IReservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (reservation.status !== ReservationStatus.NEW) {
            throw new AppError(400, 'Only NEW reservations can be confirmed');
        }

        return (await this.repository.updateStatus(id, ReservationStatus.CONFIRMED)) as IReservation;
    }

    /**
     * Cancel reservation
     * Business rule: Only NEW or CONFIRMED reservations can be canceled
     */
    public async cancel(id: string): Promise<IReservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (![ReservationStatus.NEW, ReservationStatus.CONFIRMED].includes(reservation.status)) {
            throw new AppError(400, 'Only NEW or CONFIRMED reservations can be canceled');
        }

        return (await this.repository.updateStatus(id, ReservationStatus.CANCELED)) as IReservation;
    }

    /**
     * Complete reservation
     * Business rule: Only CONFIRMED reservations can be completed
     */
    public async complete(id: string): Promise<IReservation> {
        const reservation = await this.repository.findById(id);

        if (!reservation) {
            throw new AppError(404, 'Reservation not found');
        }

        if (reservation.status !== ReservationStatus.CONFIRMED) {
            throw new AppError(400, 'Only CONFIRMED reservations can be completed');
        }

        return (await this.repository.updateStatus(id, ReservationStatus.COMPLETED)) as IReservation;
    }
}
