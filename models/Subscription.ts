import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
    email: string;
    createdAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
});

const Subscription: Model<ISubscription> = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
export default Subscription;



