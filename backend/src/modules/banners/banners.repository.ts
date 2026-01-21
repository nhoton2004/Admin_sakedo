import { DatabaseService } from '../../config/database';
import type { CreateBannerInput, UpdateBannerInput } from './banners.dto';

export class BannersRepository {
    private db = DatabaseService.getInstance();

    async findAll() {
        return this.db.homeBanner.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async findById(id: string) {
        return this.db.homeBanner.findUnique({
            where: { id },
        });
    }

    async create(data: CreateBannerInput) {
        return this.db.homeBanner.create({
            data,
        });
    }

    async update(id: string, data: UpdateBannerInput) {
        return this.db.homeBanner.update({
            where: { id },
            data,
        });
    }

    async toggleActive(id: string) {
        const banner = await this.findById(id);
        if (!banner) return null;

        return this.db.homeBanner.update({
            where: { id },
            data: { isActive: !banner.isActive },
        });
    }

    async updateOrder(id: string, order: number) {
        return this.db.homeBanner.update({
            where: { id },
            data: { order },
        });
    }

    async delete(id: string) {
        // Soft delete: set isActive to false
        return this.db.homeBanner.update({
            where: { id },
            data: { isActive: false },
        });
    }
}
