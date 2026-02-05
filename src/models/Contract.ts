import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
    contract_id: string;
    contract_type: 'Aluguel' | 'Venda';
    client_id: mongoose.Types.ObjectId;
    client_name?: string;
    items: mongoose.Types.ObjectId[];
    sale_items?: mongoose.Types.ObjectId[];
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
    package_id?: mongoose.Types.ObjectId;
    package_name?: string;
    paid_amount?: number;
    payment_method?: string;
    balance?: number;
    number?: number;
    event_location?: string;
    contact?: string;
    guest_role?: string;
    is_first_rental?: boolean;
    is_physically_signed?: boolean;
    fitting_date?: Date;
    fitting_time?: string;
    measurements?: any;
    observations?: string;
    created_at: Date;
}

const ContractSchema = new Schema<IContract>({
    contract_id: { type: String, required: true, unique: true },
    contract_type: { type: String, required: true, default: 'Aluguel' },
    client_id: { type: Schema.Types.ObjectId, ref: 'Client' },
    client_name: String,
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
    sale_items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
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
    package_id: { type: Schema.Types.ObjectId, ref: 'Package' },
    package_name: String,
    paid_amount: { type: Number, default: 0 },
    payment_method: String,
    balance: Number,
    number: Number,
    event_location: String,
    contact: String,
    guest_role: String,
    is_first_rental: Boolean,
    is_physically_signed: { type: Boolean, default: false },
    fitting_date: Date,
    fitting_time: String,
    measurements: Schema.Types.Mixed,
    observations: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IContract>('Contract', ContractSchema);
