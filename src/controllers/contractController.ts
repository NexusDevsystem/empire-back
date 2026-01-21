import { Request, Response } from 'express';
import Contract from '../models/Contract';

// Helper to map DB to Frontend
const mapToFrontend = (c: any) => ({
    id: c._id,
    clientId: c.client_id,
    items: c.items,
    startDate: c.pickup_date || c.event_date,
    endDate: c.return_date || c.event_date,
    totalValue: c.total_value,
    status: c.status,
    statusColor: c.status_color,
    eventType: c.event_type,
    terms: c.terms_text,
    debutanteDetails: c.debutante_details,
    packageDetails: c.package_details,
    lesseeSignature: c.lessee_signature,
    attendantSignature: c.attendant_signature,
    paidAmount: c.paid_amount,
    paymentMethod: c.payment_method,
    balance: c.balance,
    created_at: c.created_at
});

// Get all contracts
export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.find().sort({ created_at: -1 });
        const mapped = contracts.map(mapToFrontend);
        res.json(mapped);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create contract
export const createContract = async (req: Request, res: Response) => {
    try {
        // Map Frontend to DB
        const dbData = {
            contract_id: req.body.id || `CN-${Date.now()}`, // Fallback ID generation
            client_id: req.body.clientId,
            items: req.body.items,
            event_type: req.body.eventType,
            pickup_date: req.body.startDate,
            return_date: req.body.endDate,
            event_date: req.body.startDate, // Assumption
            total_value: req.body.totalValue,
            status: req.body.status,
            status_color: req.body.statusColor,
            terms_text: req.body.terms,
            debutante_details: req.body.debutanteDetails,
            package_details: req.body.packageDetails,
            paid_amount: req.body.paidAmount,
            payment_method: req.body.paymentMethod,
            balance: req.body.balance
        };

        const contract = new Contract(dbData);
        const saved = await contract.save();

        res.status(201).json(mapToFrontend(saved));
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Update contract
export const updateContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Map Frontend to DB partial
        const updates: any = {};
        if (req.body.clientId) updates.client_id = req.body.clientId;
        if (req.body.items) updates.items = req.body.items;
        if (req.body.eventType) updates.event_type = req.body.eventType;
        if (req.body.startDate) updates.pickup_date = req.body.startDate;
        if (req.body.endDate) updates.return_date = req.body.endDate;
        if (req.body.totalValue) updates.total_value = req.body.totalValue;
        if (req.body.status) updates.status = req.body.status;
        if (req.body.statusColor) updates.status_color = req.body.statusColor;
        if (req.body.terms) updates.terms_text = req.body.terms;
        if (req.body.debutanteDetails) updates.debutante_details = req.body.debutanteDetails;
        if (req.body.packageDetails) updates.package_details = req.body.packageDetails;
        if (req.body.lesseeSignature) updates.lessee_signature = req.body.lesseeSignature;
        if (req.body.attendantSignature) updates.attendant_signature = req.body.attendantSignature;
        if (req.body.paidAmount !== undefined) updates.paid_amount = req.body.paidAmount;
        if (req.body.paymentMethod) updates.payment_method = req.body.paymentMethod;
        if (req.body.balance !== undefined) updates.balance = req.body.balance;

        const updated = await Contract.findByIdAndUpdate(id, updates, { new: true });

        if (!updated) {
            return res.status(404).json({ message: 'Contrato não encontrado' });
        }

        res.json(mapToFrontend(updated));
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete contract
export const deleteContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deleted = await Contract.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: 'Contrato não encontrado' });
        }

        res.json({ message: 'Contrato removido' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
