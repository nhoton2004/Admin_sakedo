import { BannersRepository } from './banners.repository';
import type { CreateBannerInput, UpdateBannerInput, ReorderBannersInput } from './banners.dto';
import { AppError } from '../../common/middleware/error.middleware';

export class BannersService {
    private repository = new BannersRepository();

    async getAllBanners() {
        return this.repository.findAll();
    }

    async getBannerById(id: string) {
        const banner = await this.repository.findById(id);
        if (!banner) {
            throw new AppError(404, 'Banner not found');
        }
        return banner;
    }

    async createBanner(data: CreateBannerInput) {
        return this.repository.create(data);
    }

    async updateBanner(id: string, data: UpdateBannerInput) {
        await this.getBannerById(id); // Check exists
        return this.repository.update(id, data);
    }

    async toggleBannerActive(id: string) {
        const result = await this.repository.toggleActive(id);
        if (!result) {
            throw new AppError(404, 'Banner not found');
        }
        return result;
    }

    async reorderBanners(reorderData: ReorderBannersInput) {
        // Update order for each banner
        await Promise.all(
            reorderData.map(({ id, order }) =>
                this.repository.updateOrder(id, order)
            )
        );

        return { message: 'Banners reordered successfully' };
    }

    async deleteBanner(id: string) {
        await this.getBannerById(id); // Check exists
        return this.repository.delete(id);
    }
}
