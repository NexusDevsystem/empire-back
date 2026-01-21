import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    key: string;
    value: string;
    type: 'string' | 'number' | 'boolean' | 'json';
    created_at: Date;
}

const SettingsSchema = new Schema<ISettings>({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, enum: ['string', 'number', 'boolean', 'json'], default: 'string' },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
