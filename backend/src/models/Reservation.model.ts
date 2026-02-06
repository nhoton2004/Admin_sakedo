import mongoose, { Schema, Document } from 'mongoose';
import { ReservationStatus } from '../common/types/enums';

export interface IReservation extends Document {
    customerName: string;
    phone: string;
    datetime: Date;
    guests: number;
    note?: string;
    status: ReservationStatus;
    createdAt: Date;
}

const ReservationSchema = new Schema<IReservation>({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    datetime: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    note: { type: String },
    status: { type: String, enum: Object.values(ReservationStatus), default: ReservationStatus.NEW },
}, {
    timestamps: true,
    collection: 'reservations',
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            const obj: any = ret;
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
            return obj;
        }
    }
});

export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
