import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    // Legacy simple pricing (optional now)
    price?: number;
    sizes?: string[];

    // New
    category?: mongoose.Types.ObjectId; // Deprecated in favor of categories
    categories?: mongoose.Types.ObjectId[];
    variants: { size: string; price: number }[];
    slug: string;

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
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    variants: [{
        size: { type: String, required: true },
        price: { type: Number, required: true }
    }],
    slug: { type: String, required: false, unique: true, sparse: true },

    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
});

ProductSchema.pre('save', async function (next) {
    if (this.title && (this.isNew || this.isModified('title'))) {
        if (!this.slug) {
            let baseSlug = this.title.toString().toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');

            let uniqueSlug = baseSlug;
            let count = 1;

            // Check for uniqueness
            // Use type assertion or access via this.constructor
            // @ts-ignore
            while (await this.constructor.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
                uniqueSlug = `${baseSlug}-${count}`;
                count++;
            }
            this.slug = uniqueSlug;
        }
    }
    next();
});

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
