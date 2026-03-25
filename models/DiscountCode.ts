import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscountCode extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DiscountCodeSchema: Schema = new Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: { 
        type: String, 
        enum: ['percentage', 'fixed'], 
        required: true 
    },
    discountValue: { 
        type: Number, 
        required: true,
        min: 0 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

DiscountCodeSchema.pre('save', async function (this: IDiscountCode) {
    this.updatedAt = new Date();
});

const DiscountCode: Model<IDiscountCode> = mongoose.models.DiscountCode || mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);
export default DiscountCode;
