import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    name: string;
    isActive: boolean;
    createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    collection: 'categories',
});

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
