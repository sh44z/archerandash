import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    paypalOrderId: string;
    customer: {
        name: string;
        email: string;
        address?: {
            line1: string;
            line2?: string;
            city: string;
            state: string;
            postal_code: string;
            country_code: string;
        };
    };
    total: number;
    currency: string;
    products: Array<{
        productId: string;
        productName: string;
        size: string;
        price: number;
        quantity: number;
        subtotal: number;
    }>;
    status: 'paid' | 'shipped' | 'completed' | 'cancelled';
    orderDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    paypalOrderId: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: {
            line1: { type: String },
            line2: { type: String },
            city: { type: String },
            state: { type: String },
            postal_code: { type: String },
            country_code: { type: String }
        }
    },
    total: { type: Number, required: true },
    currency: { type: String, required: true, default: 'GBP' },
    products: [{
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        subtotal: { type: Number, required: true }
    }],
    status: { type: String, enum: ['paid', 'shipped', 'completed', 'cancelled'], default: 'paid' },
    orderDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Prevent overwrite on HMR
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;