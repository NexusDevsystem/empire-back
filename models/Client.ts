import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    name: string;
    email?: string;
    phone?: string;
    cpf?: string;
    rg?: string;
    address_street?: string;
    address_number?: string;
    address_neighborhood?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
    birth_date?: Date;
    measurements?: any;
    created_at: Date;
}

const ClientSchema = new Schema<IClient>({
    name: { type: String, required: true },
    email: String,
    phone: String,
    cpf: { type: String, sparse: true },
    rg: String,
    address_street: String,
    address_number: String,
    address_neighborhood: String,
    address_city: String,
    address_state: String,
    address_zip: String,
    birth_date: Date,
    measurements: Schema.Types.Mixed,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
