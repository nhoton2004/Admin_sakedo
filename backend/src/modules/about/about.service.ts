import { AboutRepository } from './about.repository';
import type { UpdateAboutInput } from './about.dto';

export class AboutService {
    private repository = new AboutRepository();

    async get() {
        const about = await this.repository.get();
        if (!about) {
            return {
                heading: '',
                content: '',
                imageUrl: null,
            };
        }
        return about;
    }

    async update(data: UpdateAboutInput) {
        return this.repository.update(data);
    }
}
