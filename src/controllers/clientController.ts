import { Request, Response } from 'express';
import Client from '../models/Client';
import { logSystemAction } from '../utils/logger';

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find().sort({ created_at: -1 });
        res.json(clients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(client);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json(client);

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Clientes',
            `${user?.full_name || 'Usuário'} cadastrou o cliente <strong>${client.name}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json(client);

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Clientes',
            `${user?.full_name || 'Usuário'} atualizou os dados do cliente <strong>${client.name}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }
        res.json({ message: 'Cliente deletado com sucesso' });

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Clientes',
            `${user?.full_name || 'Usuário'} removeu o registro do cliente <strong>${client.name}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
