import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database';

// Routes
import authRoutes from './routes/auth';
import itemRoutes from './routes/items';
import clientRoutes from './routes/clients';
import contractRoutes from './routes/contracts';
import appointmentRoutes from './routes/appointments';
import transactionRoutes from './routes/transactions';
import employeeRoutes from './routes/employees';
import notificationRoutes from './routes/notifications';
import notificationRoutes from './routes/notifications';
import settingsRoutes from './routes/settings';
import logRoutes from './routes/logs';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middleware
app.use(helmet()); // Set security headers

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://empire-trajes.vercel.app',
    'https://empire-trajes-finos.vercel.app',
    'https://empire-front.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 login requests per windowMs
    message: { message: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiter specifically to auth routes
app.use('/api/auth', loginLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Empire ERP API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}/api`);
});
