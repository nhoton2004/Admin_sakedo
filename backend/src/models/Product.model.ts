import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Document {
    categoryId: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    isActive: boolean;
    isFeatured: boolean;
    isDeleted: boolean;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
    collection: 'products',
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
