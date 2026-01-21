import { Request, Response } from 'express';
import Item from '../models/Item';

// Get all items
export const getItems = async (req: Request, res: Response) => {
    try {
        const items = await Item.find().sort({ created_at: -1 });
        res.json(items);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get single item
export const getItem = async (req: Request, res: Response) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create item
export const createItem = async (req: Request, res: Response) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update item
export const updateItem = async (req: Request, res: Response) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json(item);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete item
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item não encontrado' });
        }
        res.json({ message: 'Item deletado com sucesso' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
