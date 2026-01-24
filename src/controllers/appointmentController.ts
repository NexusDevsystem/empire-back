import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import { logSystemAction } from '../utils/logger';

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        // Populate client name for display if needed, but frontend might handle it by ID
        // For now, raw data
        const appointments = await Appointment.find().sort({ date: 1, time: 1 });

        // Map to frontend interface if needed, usually _id -> id
        const mapped = appointments.map(a => ({
            id: a._id,
            clientId: a.clientId,
            clientName: a.clientName,
            contractId: a.contractId,
            date: a.date,
            time: a.time,
            type: a.type,
            notes: a.notes,
            status: a.status
        }));

        res.json(mapped);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create appointment
export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointment = new Appointment(req.body);
        const saved = await appointment.save();

        res.status(201).json({
            id: saved._id,
            clientId: saved.clientId,
            clientName: saved.clientName,
            contractId: saved.contractId,
            date: saved.date,
            time: saved.time,
            type: saved.type,
            notes: saved.notes,
            status: saved.status
        });

        // Log system action
        // Log system action
        const user = (req as any).user;

        let formattedDate = '';
        try {
            if (saved.date instanceof Date) {
                formattedDate = saved.date.toLocaleDateString('pt-BR');
            } else {
                formattedDate = new Date(saved.date).toLocaleDateString('pt-BR');
            }
        } catch (e) {
            formattedDate = String(saved.date);
        }

        await logSystemAction(
            'Agendamentos',
            `${user?.full_name || 'Usuário'} agendou <strong>${saved.type}</strong> para o cliente <strong>${saved.clientName}</strong> em <strong>${formattedDate}</strong>, às ${saved.time}`,
            user
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updated = await Appointment.findByIdAndUpdate(id, req.body, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.json({
            id: updated._id,
            clientId: updated.clientId,
            clientName: updated.clientName,
            contractId: updated.contractId,
            date: updated.date,
            time: updated.time,
            type: updated.type,
            notes: updated.notes,
            status: updated.status
        });

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Agendamentos',
            `${user?.full_name || 'Usuário'} alterou o agendamento de <strong>${updated.type}</strong> para o cliente <strong>${updated.clientName}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Appointment.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Agendamento não encontrado' });
        }

        res.json({ message: 'Agendamento removido' });

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Agendamentos',
            `${user?.full_name || 'Usuário'} removeu um agendamento de <strong>${deleted.type}</strong> do cliente <strong>${deleted.clientName}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
