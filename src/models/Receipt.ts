import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
    number: number;
    value: number;
    clientName: string;
    clientDoc?: string;
    clientId?: mongoose.Types.ObjectId;
    date: Date;
    concept: string; // Description like "Referente ao contrato X"
    paymentMethod: string;
    contractId?: string;
    created_at: Date;
}

const ReceiptSchema = new Schema<IReceipt>({
    number: { type: Number, unique: true },
    value: { type: Number, required: true },
    clientName: { type: String, required: true },
    clientDoc: { type: String }, // CPF or CNPJ
    clientId: { type: Schema.Types.ObjectId, ref: 'Client' },
    date: { type: Date, default: Date.now },
    concept: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    contractId: { type: String },
    created_at: { type: Date, default: Date.now }
});

// Auto-increment number
// Auto-increment number
ReceiptSchema.pre('save', async function (this: IReceipt) {
    if (this.isNew) {
        const lastReceipt = await mongoose.model<IReceipt>('Receipt').findOne().sort({ number: -1 });
        this.number = lastReceipt ? lastReceipt.number + 1 : 1;
    }
});

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);
