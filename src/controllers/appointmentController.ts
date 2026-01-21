import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

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
            contractId: saved.contractId,
            date: saved.date,
            time: saved.time,
            type: saved.type,
            notes: saved.notes,
            status: saved.status
        });
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
            contractId: updated.contractId,
            date: updated.date,
            time: updated.time,
            type: updated.type,
            notes: updated.notes,
            status: updated.status
        });
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
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
