import { Request, Response } from 'express';
import Transaction from '../models/Transaction';

// Get all transactions
export const getAllTransactions = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        const mapped = transactions.map(t => ({
            id: t._id,
            type: t.type,
            amount: t.amount,
            description: t.description,
            category: t.category,
            date: t.date
        }));
        res.json(mapped);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { type, amount, description, category, date } = req.body;
        const transaction = new Transaction({
            type,
            amount,
            description,
            category,
            date: date || new Date()
        });
        const saved = await transaction.save();
        res.status(201).json({
            id: saved._id,
            type: saved.type,
            amount: saved.amount,
            description: saved.description,
            category: saved.category,
            date: saved.date
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete transaction
export const deleteTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Transaction.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }
        res.json({ message: 'Transação removida com sucesso' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
