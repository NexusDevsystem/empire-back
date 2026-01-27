import { Request, Response } from 'express';
import Receipt from '../models/Receipt';

export const getReceipts = async (req: Request, res: Response) => {
    try {
        const receipts = await Receipt.find().sort({ date: -1 });
        res.json(receipts);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar recibos', error });
    }
};

export const createReceipt = async (req: Request, res: Response) => {
    try {
        const newReceipt = await Receipt.create(req.body);
        res.status(201).json(newReceipt);
    } catch (error) {
        console.error('Erro ao criar recibo:', error);
        res.status(400).json({ message: 'Erro ao criar recibo', error });
    }
};

export const deleteReceipt = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Receipt.findByIdAndDelete(id);
        res.json({ message: 'Recibo removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover recibo', error });
    }
};
