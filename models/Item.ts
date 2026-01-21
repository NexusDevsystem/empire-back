import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    sku?: string;
    name: string;
    type: string;
    size: string;
    color?: string;
    rental_price: number;
    cost_price?: number;
    status: string;
    status_color: string;
    image_url?: string;
    location?: string;
    notes?: string;
    created_at: Date;
}

const ItemSchema = new Schema<IItem>({
    sku: { type: String, sparse: true },
    name: { type: String, required: true },
    type: String,
    size: String,
    color: String,
    rental_price: { type: Number, required: true, default: 0 },
    cost_price: Number,
    status: { type: String, required: true, default: 'Disponível' },
    status_color: { type: String, default: 'primary' },
    image_url: String,
    location: String,
    notes: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
