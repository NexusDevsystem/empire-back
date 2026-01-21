import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user_id?: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'alert' | 'info' | 'success' | 'warning';
    link?: string;
    read: boolean;
    created_at: Date;
}

const NotificationSchema = new Schema<INotification>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['alert', 'info', 'success', 'warning'], required: true },
    link: String,
    read: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
