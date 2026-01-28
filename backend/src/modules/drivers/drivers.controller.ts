import { Request, Response, NextFunction } from 'express';
import { DriverService } from './drivers.service';

export class DriverController {
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const drivers = await DriverService.getAll();
            res.json(drivers);
        } catch (error) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const driver = await DriverService.create(req.body);
            res.status(201).json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const driver = await DriverService.update(req.params.id, req.body);
            res.json(driver);
        } catch (error) {
            next(error);
        }
    }

    static async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await DriverService.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }
}
