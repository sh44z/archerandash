import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPopupSetting extends Document {
    isEnabled: boolean;
    chatTitle: string;
    chatMessage: string;
    discountCode: string;
    successMessage: string;
    placeholderText: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const PopupSettingSchema: Schema = new Schema({
    isEnabled: { type: Boolean, default: true },
    chatTitle: { type: String, default: 'Olivia from Archer & Ash' },
    chatMessage: { type: String, default: 'Hey there! Thanks for adding an item to your basket. Enter your email below to get a 15% discount code instantly!' },
    discountCode: { type: String, default: '' },
    successMessage: { type: String, default: 'Awesome! Use your code at checkout for 15% off.' },
    placeholderText: { type: String, default: 'Enter your email...' },
    avatarUrl: { type: String, default: '/images/logo.jpg' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

PopupSettingSchema.pre('save', async function (this: IPopupSetting) {
    this.updatedAt = new Date();
});

const PopupSetting: Model<IPopupSetting> = mongoose.models.PopupSetting || mongoose.model<IPopupSetting>('PopupSetting', PopupSettingSchema);
export default PopupSetting;
