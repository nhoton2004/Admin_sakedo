import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    userId?: Schema.Types.ObjectId;
    fullName: string;
    phone: string;
    guestCount: number;
    bookingDate: Date;
    expiryDate?: Date;
    tableNumber?: number;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    _class?: string;
}

const BookingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: false }, // Optional as admin might create walk-in
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    guestCount: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    expiryDate: { type: Date },
    tableNumber: { type: Number },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NEW'],
        default: 'PENDING'
    },
    _class: { type: String }
}, {
    timestamps: false, // Legacy system might not use timestamps or handles them differently
    collection: 'bookings'
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
