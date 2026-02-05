import { Request, Response } from 'express';
import Package from '../models/Package';

export const packageController = {
    // Create new package
    create: async (req: Request, res: Response) => {
        try {
            const newPackage = new Package(req.body);
            const savedPackage = await newPackage.save();
            res.status(201).json(savedPackage);
        } catch (error) {
            res.status(400).json({ message: 'Error creating package', error });
        }
    },

    // Get all packages
    getAll: async (req: Request, res: Response) => {
        try {
            const packages = await Package.find({ active: true }).sort({ name: 1 });
            res.json(packages);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching packages', error });
        }
    },

    // Get single package by ID
    getById: async (req: Request, res: Response) => {
        try {
            const pkg = await Package.findById(req.params.id);
            if (!pkg) {
                return res.status(404).json({ message: 'Package not found' });
            }
            res.json(pkg);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching package', error });
        }
    },

    // Update package
    update: async (req: Request, res: Response) => {
        try {
            const updatedPackage = await Package.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedPackage) {
                return res.status(404).json({ message: 'Package not found' });
            }
            res.json(updatedPackage);
        } catch (error) {
            res.status(400).json({ message: 'Error updating package', error });
        }
    },

    // Delete (soft delete) package
    delete: async (req: Request, res: Response) => {
        try {
            const deletedPackage = await Package.findByIdAndUpdate(
                req.params.id,
                { active: false },
                { new: true }
            );
            if (!deletedPackage) {
                return res.status(404).json({ message: 'Package not found' });
            }
            res.json({ message: 'Package deactivated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting package', error });
        }
    }
};
