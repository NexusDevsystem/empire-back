import mongoose, { Schema, Document } from 'mongoose';

export interface IPackageItemConfig {
    category: string; // Ex: 'Paletó', 'Calça', 'Sapato'
    quantity: number;
}

export interface IPackage extends Document {
    name: string;
    description?: string;
    price: number;
    items_config: IPackageItemConfig[];
    active: boolean;
    created_at: Date;
}

const PackageSchema = new Schema<IPackage>({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    items_config: [{
        category: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IPackage>('Package', PackageSchema);
