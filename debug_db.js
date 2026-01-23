
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Schema = mongoose.Schema;
const ContractSchema = new Schema({
    contract_id: String,
    client_name: String,
    event_date: Date,
    fitting_date: Date,
    measurements: Object,
    observations: String
}, { strict: false });

const Contract = mongoose.model('Contract', ContractSchema);

async function check() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected!');

        const docs = await Contract.find().sort({ created_at: -1 }).limit(3);
        console.log('Last 3 contracts:');
        console.log(JSON.stringify(docs, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
