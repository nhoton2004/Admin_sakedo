import { DatabaseService } from '../../config/database';
import type { UpdateVideoInput } from './home.dto';

export class HomeRepository {
    private db = DatabaseService.getInstance();

    async getVideo() {
        // Get the first (and should be only) video record
        return this.db.homeVideo.findFirst({
            where: { isActive: true },
        });
    }

    async updateVideo(data: UpdateVideoInput) {
        // Try to update existing, or create if not exists
        const existing = await this.getVideo();

        if (existing) {
            return this.db.homeVideo.update({
                where: { id: existing.id },
                data,
            });
        }

        return this.db.homeVideo.create({
            data,
        });
    }
}
