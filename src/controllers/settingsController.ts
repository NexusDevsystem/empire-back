import { Request, Response } from 'express';
import Settings from '../models/Settings';

export const getSettings = async (req: Request, res: Response) => {
    try {
        // Try to find the single settings document
        let settings = await Settings.findOne();

        // If not found, create default
        if (!settings) {
            settings = await Settings.create({});
        }

        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        const updates = req.body;

        // Upsert the single settings document
        const settings = await Settings.findOneAndUpdate(
            {},
            { ...updates, updated_at: new Date() },
            { new: true, upsert: true } // Create if doesn't exist
        );

        res.json(settings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
