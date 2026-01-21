import { Request, Response, NextFunction } from 'express';
import { BannersService } from './banners.service';
import { CreateBannerDto, UpdateBannerDto, ReorderBannersDto } from './banners.dto';
import { z } from 'zod';

export class BannersController {
    private service = new BannersService();

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const banners = await this.service.getAllBanners();
            res.json(banners);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const banner = await this.service.getBannerById(id);
            res.json(banner);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = CreateBannerDto.parse(req.body);
            const banner = await this.service.createBanner(validatedData);
            res.status(201).json(banner);
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

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const validatedData = UpdateBannerDto.parse(req.body);
            const banner = await this.service.updateBanner(id, validatedData);
            res.json(banner);
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

    toggleActive = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const banner = await this.service.toggleBannerActive(id);
            res.json(banner);
        } catch (error) {
            next(error);
        }
    };

    reorder = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedData = ReorderBannersDto.parse(req.body);
            const result = await this.service.reorderBanners(validatedData);
            res.json(result);
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

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.service.deleteBanner(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
