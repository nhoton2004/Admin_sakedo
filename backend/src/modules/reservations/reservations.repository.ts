import { Reservation, IReservation } from '../../models';
import { ReservationFilters } from './reservations.dto';

/**
 * Repository for Reservation database operations
 */
export class ReservationsRepository {
    /**
     * Find all reservations with filters
     */
    public async findAll(filters: ReservationFilters): Promise<IReservation[]> {
        const query: any = {};

        if (filters.date) {
            const startDate = new Date(filters.date);
            const endDate = new Date(filters.date);
            endDate.setDate(endDate.getDate() + 1);

            query.datetime = {
                $gte: startDate,
                $lt: endDate,
            };
        }

        if (filters.status) {
            query.status = filters.status;
        }

        return Reservation.find(query)
            .sort({ datetime: -1 })
            .exec();
    }

    /**
     * Find reservation by ID
     */
    public async findById(id: string): Promise<IReservation | null> {
        return Reservation.findById(id).exec();
    }

    /**
     * Update reservation status
     */
    public async updateStatus(id: string, status: string): Promise<IReservation | null> {
        return Reservation.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).exec();
    }
}
