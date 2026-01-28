import { HomeVideo, IHomeVideo } from '../../models';
import type { UpdateVideoInput } from './home.dto';

export class HomeRepository {
    async getVideo(): Promise<IHomeVideo | null> {
        // Get the first (and should be only) video record
        return HomeVideo.findOne({ isActive: true }).exec();
    }

    async updateVideo(data: UpdateVideoInput): Promise<IHomeVideo> {
        // Try to update existing, or create if not exists
        const existing = await this.getVideo();

        if (existing) {
            return HomeVideo.findByIdAndUpdate(
                existing._id,
                data,
                { new: true }
            ).exec() as Promise<IHomeVideo>;
        }

        const video = new HomeVideo(data);
        return video.save();
    }
}
