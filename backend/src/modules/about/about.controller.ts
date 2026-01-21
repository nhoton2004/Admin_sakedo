import { Request, Response, NextFunction } from 'express';
import { AboutService } from './about.service';
import { UpdateAboutDto } from './about.dto';
import { z } from 'zod';

export class AboutController {
    private service = new AboutService();

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const about = await this.service.get();
            res.json(about);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = UpdateAboutDto.parse(req.body);
            const about = await this.service.update(validatedData);
            res.json(about);
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    details: error.errors,
                });
            }
            next(error);
        }
    };
}
