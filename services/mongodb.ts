import mongoose from 'mongoose';

const MONGODB_URI = import.meta.env.MONGODB_URI || 'mongodb+srv://Nexus:Suasenha123@nexusteam.mayhjak.mongodb.net/EmpireTrajesFinos';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) {
        console.log('[MongoDB] Already connected');
        return;
    }

    try {
        console.log('[MongoDB] Connecting...');
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('[MongoDB] ✅ Connected successfully');
    } catch (error) {
        console.error('[MongoDB] ❌ Connection failed:', error);
        throw error;
    }
};

export const disconnectDB = async () => {
    if (!isConnected) return;

    await mongoose.disconnect();
    isConnected = false;
    console.log('[MongoDB] Disconnected');
};

export default mongoose;
