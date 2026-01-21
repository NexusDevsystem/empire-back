import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
    user_id: mongoose.Types.ObjectId;
    role: 'admin' | 'gerente' | 'vendedor' | 'pending';
    avatar_url?: string;
    created_at: Date;
}

const ProfileSchema = new Schema<IProfile>({
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    role: { type: String, enum: ['admin', 'gerente', 'vendedor', 'pending'], default: 'pending' },
    avatar_url: String,
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IProfile>('Profile', ProfileSchema);
