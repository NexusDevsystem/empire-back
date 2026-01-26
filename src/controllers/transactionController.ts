import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import { logSystemAction } from '../utils/logger';

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
            date: t.date,
            status: t.status,
            dueDate: t.due_date
        }));
        res.json(mapped);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create transaction
export const createTransaction = async (req: Request, res: Response) => {
    try {
        const { type, amount, description, category, date, status, dueDate } = req.body;
        const transaction = new Transaction({
            type,
            amount,
            description,
            category,
            status: status || 'pago',
            due_date: dueDate,
            date: date || new Date()
        });
        const saved = await transaction.save();
        res.status(201).json({
            id: saved._id,
            type: saved.type,
            amount: saved.amount,
            description: saved.description,
            category: saved.category,
            date: saved.date,
            status: saved.status,
            dueDate: saved.due_date
        });

        // Log system action
        const user = (req as any).user;
        const msgType = type === 'income' ? 'Entrada' : 'Saída';
        await logSystemAction(
            'Financeiro',
            `${user?.full_name || 'Usuário'} lançou uma <strong>${msgType}</strong> de <strong>R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (${description})`,
            user
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Update transaction
export const updateTransaction = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, amount, description, category, date, dueDate } = req.body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (amount !== undefined) updateData.amount = amount;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (date) updateData.date = date;
        if (dueDate !== undefined) updateData.due_date = dueDate;

        const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Transação não encontrada' });
        }

        res.json({
            id: updated._id,
            type: updated.type,
            amount: updated.amount,
            description: updated.description,
            category: updated.category,
            date: updated.date,
            status: updated.status,
            dueDate: updated.due_date
        });

        // Log system action if status changed
        if (status) {
            const user = (req as any).user;
            await logSystemAction(
                'Financeiro',
                `${user?.full_name || 'Usuário'} atualizou o status da conta <strong>${updated.description}</strong> para <strong>${status.toUpperCase()}</strong>`,
                user
            );
        }
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

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Financeiro',
            `${user?.full_name || 'Usuário'} removeu um lançamento de <strong>R$ ${deleted.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> (${deleted.description})`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
