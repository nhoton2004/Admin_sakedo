import { DatabaseService } from '../../config/database';
import type { UpdateAboutInput } from './about.dto';

export class AboutRepository {
    private db = DatabaseService.getInstance();

    async get() {
        return this.db.aboutSection.findFirst();
    }

    async update(data: UpdateAboutInput) {
        const existing = await this.get();

        if (existing) {
            return this.db.aboutSection.update({
                where: { id: existing.id },
                data,
            });
        }

        return this.db.aboutSection.create({
            data,
        });
    }
}
