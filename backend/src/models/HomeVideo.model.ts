import mongoose, { Schema, Document } from 'mongoose';

export interface IHomeVideo extends Document {
    videoUrl: string;
    isActive: boolean;
    updatedAt: Date;
}

const HomeVideoSchema = new Schema<IHomeVideo>({
    videoUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: 'home_videos',
});

export const HomeVideo = mongoose.model<IHomeVideo>('HomeVideo', HomeVideoSchema);
