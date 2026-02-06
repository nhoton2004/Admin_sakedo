import { IReservation } from '../../models';
import Booking from '../../models/Booking.model'; // Import Booking model
import { AppError } from '../../common/middleware/error.middleware';
import { ReservationFilters } from './reservations.dto';
import { ReservationsRepository } from './reservations.repository';
import { ReservationStatus } from '../../common/types/enums';

/**
 * Service for reservation business logic
 * Implements Dual Write to sync 'reservations' (Admin) with 'bookings' (App)
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
     * Helper to sync status to bookings collection
     */
    private async syncStatusToBooking(reservation: IReservation, newStatus: string) {
        try {
            // Map Admin status to App status
            let bookingStatus = 'PENDING';
            if (newStatus === ReservationStatus.CONFIRMED) bookingStatus = 'CONFIRMED';
            if (newStatus === ReservationStatus.COMPLETED) bookingStatus = 'COMPLETED';
            if (newStatus === ReservationStatus.CANCELED) bookingStatus = 'CANCELLED'; // Note spelling: CANCELLED (2 L's typically)

            // Try to find matching booking by phone and date (fuzzy match)
            // Or ideally store bookingId in reservation. For now we try fuzzy match.
            const startOfDay = new Date(reservation.datetime);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(reservation.datetime);
            endOfDay.setHours(23, 59, 59, 999);

            await Booking.updateOne(
                {
                    phone: reservation.phone,
                    bookingDate: { $gte: startOfDay, $lte: endOfDay }
                },
                { $set: { status: bookingStatus } }
            );
            console.log(`✅ Synced reservation status to 'bookings': ${bookingStatus}`);
        } catch (error) {
            console.error(`❌ Failed to sync reservation status:`, error);
        }
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

        const updated = (await this.repository.updateStatus(id, ReservationStatus.CONFIRMED)) as IReservation;
        await this.syncStatusToBooking(updated, ReservationStatus.CONFIRMED);

        return updated;
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

        const updated = (await this.repository.updateStatus(id, ReservationStatus.CANCELED)) as IReservation;
        await this.syncStatusToBooking(updated, ReservationStatus.CANCELED);

        return updated;
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

        const updated = (await this.repository.updateStatus(id, ReservationStatus.COMPLETED)) as IReservation;
        await this.syncStatusToBooking(updated, ReservationStatus.COMPLETED);

        return updated;
    }
}
