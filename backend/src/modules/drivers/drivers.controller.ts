import { Request, Response, NextFunction } from 'express';
import { DriverService } from './drivers.service';

/**
 * Driver Controller
 * Now uses instance-based DriverService (proper OOP)
 */
export class DriverController {
    private service: DriverService;

    constructor() {
        this.service = new DriverService();
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const controller = new DriverController();
            const drivers = await controller.service.getAll();
            res.json(drivers);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const controller = new DriverController();
            const driver = await controller.service.create(req.body);
            res.status(201).json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const controller = new DriverController();
            const driver = await controller.service.update(req.params.id, req.body);
            res.json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const controller = new DriverController();
            const stats = await controller.service.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}
