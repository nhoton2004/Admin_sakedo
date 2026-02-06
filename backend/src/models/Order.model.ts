import mongoose, { Schema, Document, Types } from 'mongoose';
import { OrderStatus } from '../common/types/enums';

export interface IOrderItem {
    productId: Types.ObjectId;
    qty: number;
    price: number;
}

export interface IOrder extends Document {
    customerId?: Types.ObjectId;
    customerName: string;
    phone: string;
    address: string;
    note?: string;
    total: number;
    status: OrderStatus;
    assignedDriverId?: Types.ObjectId;
    items: IOrderItem[];
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    total: { type: Number, required: true, min: 0 },
    // Relaxed validation to support legacy data (numeric strings like "0", "1", etc.)
    status: { type: String, default: OrderStatus.PENDING },
    assignedDriverId: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
}, {
    timestamps: true,
    collection: 'orders',
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
