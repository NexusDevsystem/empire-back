import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    date: Date;
    read: boolean;
    link?: string;
    metadata?: any;
}

const NotificationSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error'],
        default: 'info'
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String
    },
    metadata: {
        type: Schema.Types.Mixed
    }
});

// Index for faster queries on unread notifications for a specific user
NotificationSchema.index({ user: 1, read: 1, date: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
