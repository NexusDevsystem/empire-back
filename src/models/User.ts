import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    email: string;
    password: string;
    full_name: string;
    created_at: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
