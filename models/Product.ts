import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    // Legacy simple pricing (optional now)
    price?: number;
    sizes?: string[];

    // New fields
    category?: mongoose.Types.ObjectId;
    variants: { size: string; price: number }[];

    images: string[];
    createdAt: Date;
}

const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },

    // Legacy
    price: { type: Number, required: false },
    sizes: { type: [String], default: [] },

    // New
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: false },
    variants: [{
        size: { type: String, required: true },
        price: { type: Number, required: true }
    }],

    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
