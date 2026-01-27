
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Force load .env from backend root
dotenv.config({ path: path.resolve('backend/.env') }); // Try specific path first
if (!process.env.MONGODB_URI) {
    dotenv.config(); // Fallback to default
}

const uri = process.env.MONGODB_URI;

console.log('--- DB CHECK ---');
console.log('ENV MONGODB_URI:', uri ? uri.substring(0, 20) + '...' : 'UNDEFINED');

if (!uri) {
    console.error('❌ MONGODB_URI not found in environment!');
    process.exit(1);
}

async function check() {
    try {
        await mongoose.connect(uri!);
        console.log('✅ Connected to DB defined in .env');

        const User = mongoose.model('User', new mongoose.Schema({ email: String }, { strict: false }));
        const user = await User.findOne({ email: 'empire@admin.com' });

        if (user) {
            console.log('✅ User empire@admin.com FOUND in this DB.');
            console.log('   ID:', user._id);
        } else {
            console.log('❌ User empire@admin.com NOT FOUND in this DB.');
            console.log('   This implies the server is connected to a different DB than the one create-admin.mjs updated.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

check();
