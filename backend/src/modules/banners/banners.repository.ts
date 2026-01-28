import { HomeBanner, IHomeBanner } from '../../models';
import type { CreateBannerInput, UpdateBannerInput } from './banners.dto';

export class BannersRepository {
    async findAll(): Promise<IHomeBanner[]> {
        return HomeBanner.find().sort({ order: 1 }).exec();
    }

    async findById(id: string): Promise<IHomeBanner | null> {
        return HomeBanner.findById(id).exec();
    }

    async create(data: CreateBannerInput): Promise<IHomeBanner> {
        const banner = new HomeBanner(data);
        return banner.save();
    }

    async update(id: string, data: UpdateBannerInput): Promise<IHomeBanner | null> {
        return HomeBanner.findByIdAndUpdate(
            id,
            data,
            { new: true }
        ).exec();
    }

    async toggleActive(id: string): Promise<IHomeBanner | null> {
        const banner = await this.findById(id);
        if (!banner) return null;

        return HomeBanner.findByIdAndUpdate(
            id,
            { isActive: !banner.isActive },
            { new: true }
        ).exec();
    }

    async updateOrder(id: string, order: number): Promise<IHomeBanner | null> {
        return HomeBanner.findByIdAndUpdate(
            id,
            { order },
            { new: true }
        ).exec();
    }

    async delete(id: string): Promise<IHomeBanner | null> {
        // Soft delete: set isActive to false
        return HomeBanner.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        ).exec();
    }
}
