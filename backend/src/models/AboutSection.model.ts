import mongoose, { Schema, Document } from 'mongoose';

export interface IAboutSection extends Document {
    heading: string;
    content: string;
    imageUrl?: string;
    updatedAt: Date;
}

const AboutSectionSchema = new Schema<IAboutSection>({
    heading: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String },
}, {
    timestamps: true,
    collection: 'about_sections',
});

export const AboutSection = mongoose.model<IAboutSection>('AboutSection', AboutSectionSchema);
