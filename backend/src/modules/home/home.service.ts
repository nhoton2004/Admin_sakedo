import { HomeRepository } from './home.repository';
import type { UpdateVideoInput } from './home.dto';

export class HomeService {
    private repository = new HomeRepository();

    async getVideo() {
        const video = await this.repository.getVideo();
        if (!video) {
            // Return default empty object if not set yet
            return { videoUrl: '', isActive: true };
        }
        return video;
    }

    async updateVideo(data: UpdateVideoInput) {
        return this.repository.updateVideo(data);
    }
}
