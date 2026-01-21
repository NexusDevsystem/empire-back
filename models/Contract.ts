import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
    contract_id: string; // Custom ID like #CN-2023-849
    client_id: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[]; // Array of Item IDs
    event_type?: string;
    event_date?: Date;
    pickup_date?: Date;
    return_date?: Date;
    total_value: number;
    discount_amount?: number;
    status: string;
    status_color: string;
    terms_text?: string;
    signatures?: any;
    debutante_details?: any;
    package_details?: any;
    created_at: Date;
}

const ContractSchema = new Schema<IContract>({
    contract_id: { type: String, required: true, unique: true },
    client_id: { type: Schema.Types.ObjectId, ref: 'Client' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    event_type: String,
    event_date: Date,
    pickup_date: Date,
    return_date: Date,
    total_value: { type: Number, required: true, default: 0 },
    discount_amount: { type: Number, default: 0 },
    status: { type: String, required: true, default: 'Rascunho' },
    status_color: { type: String, default: 'gray' },
    terms_text: String,
    signatures: Schema.Types.Mixed,
    debutante_details: Schema.Types.Mixed,
    package_details: Schema.Types.Mixed,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);
