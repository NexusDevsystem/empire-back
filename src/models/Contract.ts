import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
    contract_id: string;
    client_id: mongoose.Types.ObjectId;
    items: mongoose.Types.ObjectId[];
    event_type?: string;
    event_date?: Date;
    pickup_date?: Date;
    return_date?: Date;
    total_value: number;
    discount_amount?: number;
    status: string;
    status_color: string;
    terms_text?: string;
    lessee_signature?: string;
    attendant_signature?: string;
    signatures?: any;
    debutante_details?: any;
    package_details?: any;
    paid_amount?: number;
    payment_method?: string;
    balance?: number;
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
    lessee_signature: String,
    attendant_signature: String,
    signatures: Schema.Types.Mixed,
    debutante_details: Schema.Types.Mixed,
    package_details: Schema.Types.Mixed,
    paid_amount: { type: Number, default: 0 },
    payment_method: String,
    balance: Number,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IContract>('Contract', ContractSchema);
