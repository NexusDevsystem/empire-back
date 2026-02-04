import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    store_name: { type: String, default: 'Empire Trajes Finos' },
    store_cnpj: { type: String, default: '52.377.689/0001-71' },
    store_address: { type: String, default: '' },
    store_phone: { type: String, default: '' },
    store_instagram: { type: String, default: '@empiretrajesfinos' },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Settings', settingsSchema);
