import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeBanner extends Document {
    title: string;
    subtitle?: string;
    imageUrl: string;
    ctaText?: string;
    ctaLink?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const HomeBannerSchema = new Schema<IHomeBanner>({
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    ctaText: { type: String },
    ctaLink: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: 'home_banners',
});

export const HomeBanner = mongoose.model<IHomeBanner>('HomeBanner', HomeBannerSchema);
