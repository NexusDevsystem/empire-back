import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    type: string;
    size: string;
    color?: string;
    rental_price: number;
    sale_price?: number;
    status: string;
    status_color: string;
    image_url?: string;
    location?: string;
    notes?: string;

    // Campos de quantidade para sistema de estoque
    total_quantity?: number;        // Quantidade total de unidades
    available_quantity?: number;    // Unidades disponíveis para aluguel
    rented_units?: number;          // Unidades atualmente alugadas

    created_at: Date;
}

const ItemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    type: String,
    size: String,
    color: String,
    rental_price: { type: Number, required: true, default: 0 },
    sale_price: { type: Number, default: 0 },
    status: { type: String, required: true, default: 'Disponível' },
    status_color: { type: String, default: 'primary' },
    image_url: String,
    location: String,
    notes: String,

    // Campos de quantidade (compatibilidade com itens antigos)
    total_quantity: { type: Number, default: 1 },
    available_quantity: { type: Number, default: 1 },
    rented_units: { type: Number, default: 0 },

    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IItem>('Item', ItemSchema);
