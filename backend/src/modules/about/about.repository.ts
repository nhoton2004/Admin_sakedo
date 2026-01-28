import { AboutSection, IAboutSection } from '../../models';
import type { UpdateAboutInput } from './about.dto';

export class AboutRepository {
    async get(): Promise<IAboutSection | null> {
        return AboutSection.findOne().exec();
    }

    async update(data: UpdateAboutInput): Promise<IAboutSection> {
        const existing = await this.get();

        if (existing) {
            return AboutSection.findByIdAndUpdate(
                existing._id,
                data,
                { new: true }
            ).exec() as Promise<IAboutSection>;
        }

        const section = new AboutSection(data);
        return section.save();
    }
}
