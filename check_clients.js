
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const ClientSchema = new mongoose.Schema({}, { strict: false });
const Client = mongoose.model('Client', ClientSchema);

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const clients = await Client.find().sort({ created_at: -1 }).limit(20);
        console.log('Last 20 clients:');
        clients.forEach(c => {
            console.log(`Name: ${c.name}, Profile: ${c.profile_type || 'LEGACY'}, Measurements Keys: ${Object.keys(c.measurements || {}).join(', ')}`);
            if (c.measurements) {
                const values = Object.values(c.measurements).filter(v => v !== "");
                if (values.length > 0) {
                    console.log(`  Values found: ${JSON.stringify(c.measurements)}`);
                } else {
                    console.log(`  All measurements are empty strings or missing.`);
                }
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
