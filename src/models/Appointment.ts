import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: false },
    clientName: { type: String, required: false },
    contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    // HH:mm format
    type: {
        type: String,
        required: true,
        enum: ['Primeira Visita', 'Prova de Traje', 'Retirada', 'Devolução', 'Ajustes Finais', 'Outro']
    },
    notes: String,
    status: {
        type: String,
        enum: ['Agendado', 'Concluído', 'Cancelado'],
        default: 'Agendado'
    },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Appointment', AppointmentSchema);
