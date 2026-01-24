import mongoose, { Schema, Document } from 'mongoose';

export interface ILog extends Document {
    module: string;
    description: string;
    user_id?: mongoose.Types.ObjectId;
    user_name: string;
    timestamp: Date;
    details?: any;
}

const LogSchema = new Schema<ILog>({
    module: { type: String, required: true },
    description: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_name: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    details: { type: Schema.Types.Mixed }
});

export default mongoose.model<ILog>('Log', LogSchema);
