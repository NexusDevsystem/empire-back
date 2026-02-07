
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

        const client = await Client.findOne({ name: /Lucianne/i });
        if (client) {
            console.log('Client found:');
            console.log(JSON.stringify(client, null, 2));
        } else {
            console.log('Client not found');
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
