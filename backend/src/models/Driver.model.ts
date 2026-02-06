import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
    username?: string;
    password?: string;
    name: string;
    phone: string;
    email?: string;
    vehiclePlate?: string;
    area?: string;
    status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    rating: number;
    totalEarnings: number;
    dailyEarnings: number;
    completedOrders: number;
    failedOrders: number;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    _class?: string; // For Java compatibility if needed
}

const DriverSchema: Schema = new Schema({
    username: { type: String },
    password: { type: String },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    vehiclePlate: { type: String },
    area: { type: String },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
        default: 'OFFLINE'
    },
    rating: { type: Number, default: 5 },
    totalEarnings: { type: Number, default: 0 },
    dailyEarnings: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    failedOrders: { type: Number, default: 0 },
    avatar: { type: String },
    _class: { type: String }
}, {
    timestamps: true,
    collection: 'drivers' // Explicitly map to 'drivers' collection
});

export default mongoose.model<IDriver>('Driver', DriverSchema);
