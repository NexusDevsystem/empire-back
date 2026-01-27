
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Try loading from multiple locations to match server behavior
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Root
dotenv.config({ path: path.resolve(__dirname, '../.env') });    // Backend root

const uri = process.env.MONGODB_URI;

console.log('\n--- PASSWORD RESET TOOL ---');
console.log('Target URI:', uri ? uri.split('@')[1] : 'UNDEFINED'); // Log only host for safety

if (!uri) {
    console.error('❌ MONGODB_URI not found! Check your .env placement.');
    process.exit(1);
}

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    full_name: String
}, { strict: false });

async function reset() {
    try {
        await mongoose.connect(uri);
        console.log('✅ Connected to DB.');

        const User = mongoose.model('User', UserSchema);
        const email = 'empire@admin.com';

        // 1. Find User
        let user = await User.findOne({ email });

        // 2. Hash New Password
        const newPass = 'empire@23';
        const hashedPassword = await bcrypt.hash(newPass, 10);

        if (user) {
            console.log(`found user ${user._id}, updating password...`);
            user.password = hashedPassword;
            await user.save();
            console.log('✅ Password UPDATED successfully.');
        } else {
            console.log('User not found, creating...');
            user = await User.create({
                email,
                password: hashedPassword,
                full_name: 'Empire Admin'
            });
            console.log('✅ User CREATED successfully.');
        }

        // Verify
        const verifyUser = await User.findOne({ email });
        const match = await bcrypt.compare(newPass, verifyUser.password);
        console.log('🔐 Verification check:', match ? 'MATCHES' : 'FAILS');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

reset();
