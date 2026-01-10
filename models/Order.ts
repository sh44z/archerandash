import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    paypalOrderId: string;
    customer: {
        name: string;
        email: string;
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
    shippingAddress?: {
        address_line_1: string;
        address_line_2?: string;
        admin_area_2: string; // city
        admin_area_1: string; // state/province
        postal_code: string;
        country_code: string;
    };
    status: 'paid' | 'shipped' | 'completed';
    orderDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    paypalOrderId: { type: String, required: true, unique: true },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true }
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
    shippingAddress: {
        address_line_1: { type: String },
        address_line_2: { type: String },
        admin_area_2: { type: String },
        admin_area_1: { type: String },
        postal_code: { type: String },
        country_code: { type: String }
    },
    status: { type: String, enum: ['paid', 'shipped', 'completed'], default: 'paid' },
    orderDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Prevent overwrite on HMR
const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export default Order;