import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    due_date: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pago', 'pendente'],
        default: 'pago'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Transaction', TransactionSchema);
