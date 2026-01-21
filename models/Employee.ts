import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    status: string;
    admission_date?: Date;
    salary?: number;
    commission_rate?: number;
    avatar_url?: string;
    notes?: string;
    created_at: Date;
}

const EmployeeSchema = new Schema<IEmployee>({
    name: { type: String, required: true },
    email: { type: String, sparse: true },
    phone: String,
    role: String,
    status: { type: String, required: true, default: 'Ativo' },
    admission_date: Date,
    salary: Number,
    commission_rate: Number,
    avatar_url: String,
    notes: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.models.Employee || mongoose.model<IEmployee>('Employee', EmployeeSchema);
