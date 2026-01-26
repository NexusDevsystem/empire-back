import { Request, Response } from 'express';
import Notification from '../models/Notification';

// Get user notifications
export const getMyNotifications = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const notifications = await Notification.find({ user: user._id })
            .sort({ date: -1 })
            .limit(50);

        const mapped = notifications.map(n => ({
            id: n._id,
            title: n.title,
            message: n.message,
            type: n.type,
            date: n.date,
            read: n.read,
            link: n.link
        }));

        res.json(mapped);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a notification (Internal/Admin)
export const createNotification = async (userId: string, data: any) => {
    try {
        const notification = new Notification({
            user: userId,
            ...data
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};

// Mark notification as read
export const markNotificationRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, user: user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notificação não encontrada' });
        }

        res.json({ message: 'Notificação marcada como lida' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all as read
export const markAllRead = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        await Notification.updateMany(
            { user: user._id, read: false },
            { read: true }
        );
        res.json({ message: 'Todas as notificações marcadas como lidas' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
