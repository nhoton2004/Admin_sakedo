import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    role: 'ADMIN' | 'DRIVER' | 'USER';
    isActive: boolean;
    createdAt: Date;
    // Driver specific fields
    phone?: string;
    vehiclePlate?: string;
    area?: string;
    driverStatus?: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    rating?: number;
    totalOrders?: number;
    totalEarnings?: number;
    avatar?: string;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['ADMIN', 'DRIVER', 'USER'], default: 'USER' },
    isActive: { type: Boolean, default: true },

    // Driver specific fields
    phone: { type: String },
    vehiclePlate: { type: String },
    area: { type: String },
    driverStatus: { type: String, enum: ['AVAILABLE', 'BUSY', 'OFFLINE'], default: 'OFFLINE' },
    rating: { type: Number, default: 5 },
    totalOrders: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    avatar: { type: String },
}, {
    timestamps: true,
    collection: 'users',
});

export const User = mongoose.model<IUser>('User', UserSchema);
