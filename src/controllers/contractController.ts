import { Request, Response } from 'express';
import Contract from '../models/Contract';
import { logSystemAction } from '../utils/logger';

// Helper to map DB to Frontend
const mapToFrontend = (c: any) => {
    const mapped = {
        id: c._id, // Using _id for DB operations (updates/deletes)
        customId: c.contract_id, // For display
        contractType: c.contract_type || 'Aluguel',
        clientId: c.client_id,
        clientName: c.client_name,
        items: c.items,
        saleItems: c.sale_items,
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
        isPhysicallySigned: c.is_physically_signed,
        paidAmount: c.paid_amount,
        paymentMethod: c.payment_method,
        balance: c.balance,
        number: c.number,
        eventLocation: c.event_location,
        contact: c.contact,
        guestRole: c.guest_role,
        isFirstRental: c.is_first_rental,
        eventDate: c.event_date,
        fittingDate: c.fitting_date,
        fittingTime: c.fitting_time,
        measurements: c.measurements,
        observations: c.observations,
        created_at: c.created_at
    };
    return mapped;
};

// Get all contracts
export const getAllContracts = async (req: Request, res: Response) => {
    try {
        const contracts = await Contract.find().sort({ created_at: -1 });
        const mapped = contracts.map(mapToFrontend);
        res.json(mapped);
    } catch (error: any) {
        console.error('[getAllContracts] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create contract
export const createContract = async (req: Request, res: Response) => {
    console.log('[createContract] Request body:', JSON.stringify(req.body, null, 2));
    try {
        // Generate sequential number
        const lastContract = await Contract.findOne().sort({ number: -1 });
        const nextNumber = (lastContract && lastContract.number) ? lastContract.number + 1 : 1;

        // Map Frontend to DB
        const dbData = {
            contract_id: req.body.id || `CN-${nextNumber}`,
            contract_type: req.body.contractType || 'Aluguel',
            client_id: req.body.clientId,
            client_name: req.body.clientName,
            items: req.body.items,
            sale_items: req.body.saleItems,
            event_type: req.body.eventType,
            pickup_date: req.body.startDate,
            return_date: req.body.endDate,
            event_date: req.body.eventDate || req.body.startDate,
            fitting_date: req.body.fittingDate,
            fitting_time: req.body.fittingTime,
            measurements: req.body.measurements,
            observations: req.body.observations,
            total_value: req.body.totalValue,
            status: req.body.status,
            status_color: req.body.statusColor,
            terms_text: req.body.terms,
            debutante_details: req.body.debutanteDetails,
            package_details: req.body.packageDetails,
            paid_amount: req.body.paidAmount,
            payment_method: req.body.paymentMethod,
            balance: req.body.balance,
            event_location: req.body.eventLocation,
            contact: req.body.contact,
            guest_role: req.body.guestRole,
            is_first_rental: req.body.isFirstRental,
            is_physically_signed: req.body.isPhysicallySigned,
            number: nextNumber
        };

        console.log('[createContract] Saving dbData:', JSON.stringify(dbData, null, 2));

        const contract = new Contract(dbData);
        const saved = await contract.save();

        res.status(201).json(mapToFrontend(saved));

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Contratos',
            `${user?.full_name || 'Usuário'} criou o contrato <strong>${saved.contract_id}</strong> para o cliente <strong>${saved.client_name}</strong> no valor de <strong>R$ ${saved.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>`,
            user
        );
    } catch (error: any) {
        console.error('[createContract] Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Update contract
export const updateContract = async (req: Request, res: Response) => {
    console.log('[updateContract] Request params:', req.params);
    console.log('[updateContract] Request body:', JSON.stringify(req.body, null, 2));

    try {
        const { id } = req.params;

        // Map Frontend to DB partial
        const updates: any = {};
        if (req.body.contractType) updates.contract_type = req.body.contractType;
        if (req.body.clientId) updates.client_id = req.body.clientId;
        if (req.body.clientName) updates.client_name = req.body.clientName;
        if (req.body.items) updates.items = req.body.items;
        if (req.body.saleItems) updates.sale_items = req.body.saleItems;
        if (req.body.eventType) updates.event_type = req.body.eventType;
        if (req.body.startDate) updates.pickup_date = req.body.startDate;
        if (req.body.endDate) updates.return_date = req.body.endDate;
        if (req.body.totalValue !== undefined) updates.total_value = req.body.totalValue;
        if (req.body.status) updates.status = req.body.status;
        if (req.body.statusColor) updates.status_color = req.body.statusColor;
        if (req.body.terms) updates.terms_text = req.body.terms;
        if (req.body.debutanteDetails) updates.debutante_details = req.body.debutanteDetails;
        if (req.body.packageDetails) updates.package_details = req.body.packageDetails;
        if (req.body.lesseeSignature !== undefined) updates.lessee_signature = req.body.lesseeSignature;
        if (req.body.attendantSignature !== undefined) updates.attendant_signature = req.body.attendantSignature;
        if (req.body.paidAmount !== undefined) updates.paid_amount = req.body.paidAmount;
        if (req.body.paymentMethod) updates.payment_method = req.body.paymentMethod;
        if (req.body.balance !== undefined) updates.balance = req.body.balance;
        if (req.body.eventLocation !== undefined) updates.event_location = req.body.eventLocation;
        if (req.body.contact !== undefined) updates.contact = req.body.contact;
        if (req.body.guestRole !== undefined) updates.guest_role = req.body.guestRole;
        if (req.body.isFirstRental !== undefined) updates.is_first_rental = req.body.isFirstRental;
        if (req.body.isPhysicallySigned !== undefined) updates.is_physically_signed = req.body.isPhysicallySigned;

        // Novos campos - Garantir que sejam salvos mesmo se vazios (null/undefined)
        if (req.body.eventDate !== undefined) updates.event_date = req.body.eventDate || null;
        if (req.body.fittingDate !== undefined) updates.fitting_date = req.body.fittingDate || null;
        if (req.body.fittingTime !== undefined) updates.fitting_time = req.body.fittingTime || "";
        if (req.body.measurements !== undefined) updates.measurements = req.body.measurements || null;
        if (req.body.observations !== undefined) updates.observations = req.body.observations || "";

        console.log('[updateContract] Applying updates:', JSON.stringify(updates, null, 2));

        // Try to update by ID (ObjectId)
        let updated = null;
        const targetId = id as string;
        if (targetId.match(/^[0-9a-fA-F]{24}$/)) {
            updated = await Contract.findByIdAndUpdate(targetId, updates, { new: true });
        }

        // If not found by ObjectId, try to find by contract_id (Custom ID)
        if (!updated) {
            updated = await Contract.findOneAndUpdate({ contract_id: id }, updates, { new: true });
        }

        if (!updated) {
            console.warn('[updateContract] Contract not found by any ID:', id);
            return res.status(404).json({ message: 'Contrato não encontrado' });
        }

        console.log('[updateContract] Updated contract success');
        res.json(mapToFrontend(updated));

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Contratos',
            `${user?.full_name || 'Usuário'} atualizou o contrato <strong>${updated.contract_id}</strong> do cliente <strong>${updated.client_name}</strong> (Status: ${updated.status})`,
            user
        );
    } catch (error: any) {
        console.error('[updateContract] Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// Delete contract
export const deleteContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let deleted = null;

        const targetId = id as string;
        if (targetId.match(/^[0-9a-fA-F]{24}$/)) {
            deleted = await Contract.findByIdAndDelete(targetId);
        }

        if (!deleted) {
            deleted = await Contract.findOneAndDelete({ contract_id: id });
        }

        if (!deleted) {
            return res.status(404).json({ message: 'Contrato não encontrado' });
        }

        res.json({ message: 'Contrato removido' });

        // Log system action
        const user = (req as any).user;
        await logSystemAction(
            'Contratos',
            `${user?.full_name || 'Usuário'} removeu o contrato <strong>${deleted.contract_id}</strong> do cliente <strong>${deleted.client_name}</strong>`,
            user
        );
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
