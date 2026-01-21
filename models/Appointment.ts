import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    client_id: mongoose.Types.ObjectId;
    contract_id?: mongoose.Types.ObjectId;
    date: string;
    time: string;
    type: string;
    status: string;
    notes?: string;
    created_at: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
    client_id: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    contract_id: { type: Schema.Types.ObjectId, ref: 'Contract' },
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true, default: 'Agendado' },
    notes: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
