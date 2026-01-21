import { Request, Response, NextFunction } from 'express';
import { HomeService } from './home.service';
import { UpdateVideoDto } from './home.dto';
import { z } from 'zod';

export class HomeController {
    private service = new HomeService();

    getVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const video = await this.service.getVideo();
            res.json(video);
        } catch (error) {
            next(error);
        }
    };

    updateVideo = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = UpdateVideoDto.parse(req.body);
            const video = await this.service.updateVideo(validatedData);
            res.json(video);
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
