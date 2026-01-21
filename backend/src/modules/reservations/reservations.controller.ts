import { Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { ReservationFilters } from './reservations.dto';
import { ReservationsService } from './reservations.service';

/**
 * Controller for reservation endpoints
 */
export class ReservationsController {
    private service: ReservationsService;

    constructor() {
        this.service = new ReservationsService();
    }

    /**
     * GET /admin/reservations
     */
    public getAll = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const filters: ReservationFilters = {
                date: req.query.date as string,
                status: req.query.status as string,
            };

            const reservations = await this.service.getAll(filters);
            res.json(reservations);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get reservations',
            });
        }
    };

    /**
     * PATCH /admin/reservations/:id/confirm
     */
    public confirm = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const reservation = await this.service.confirm(req.params.id);
            res.json(reservation);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to confirm reservation',
            });
        }
    };

    /**
     * PATCH /admin/reservations/:id/cancel
     */
    public cancel = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const reservation = await this.service.cancel(req.params.id);
            res.json(reservation);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to cancel reservation',
            });
        }
    };

    /**
     * PATCH /admin/reservations/:id/complete
     */
    public complete = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const reservation = await this.service.complete(req.params.id);
            res.json(reservation);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to complete reservation',
            });
        }
    };
}
