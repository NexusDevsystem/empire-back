import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    contract_id?: mongoose.Types.ObjectId;
    created_at: Date;
}

const TransactionSchema = new Schema<ITransaction>({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    contract_id: { type: Schema.Types.ObjectId, ref: 'Contract' },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
