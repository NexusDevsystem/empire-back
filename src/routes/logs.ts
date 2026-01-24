import express from 'express';
import Log from '../models/Log';
import User from '../models/User';

const router = express.Router();

// GET /api/logs
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const { user, module, startDate, endDate } = req.query;

        let query: any = {};

        // Filter by user (exact match on user_name or partial)
        if (user && user !== 'Todos usuários') {
            query.user_name = { $regex: user, $options: 'i' };
        }

        // Filter by module
        if (module && module !== 'Todos módulos') {
            query.module = module;
        }

        // Filter by date range
        if (startDate && endDate) {
            // Need to parse DD/MM/YYYY or YYYY-MM-DD depending on what frontend sends
            // Assuming frontend sends YYYY-MM-DD or standard ISO for easier handling
            // But let's handle standard Date parsable strings
            const start = new Date(startDate as string);
            const end = new Date(endDate as string);

            // Set end date to end of day
            end.setHours(23, 59, 59, 999);

            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                query.timestamp = { $gte: start, $lte: end };
            }
        }

        const total = await Log.countDocuments(query);
        const logs = await Log.find(query)
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            data: logs,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// GET /api/logs/users (for filter dropdown)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'full_name').sort({ full_name: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users for logs' });
    }
});

export default router;
