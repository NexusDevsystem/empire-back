import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Profile from '../models/Profile';

// Register
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, full_name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            full_name
        });

        // Create profile
        await Profile.create({
            user_id: user._id,
            role: 'pending'
        });

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: 'pending'
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Login
// Login
export const login = async (req: Request, res: Response) => {
    console.log(`[LOGIN ATTEMPT] Email: ${req.body.email}`);
    try {
        let { email, password } = req.body;
        email = email ? email.trim().toLowerCase() : '';

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('[LOGIN FAILED] User not found');
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        // Check password
        console.log('[LOGIN CHECK] Found user, comparing password...');
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.log('[LOGIN FAILED] Invalid password');
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        console.log('[LOGIN SUCCESS] Password valid, fetching profile...');
        // Get profile
        const profile = await Profile.findOne({ user_id: user._id });
        console.log(`[LOGIN PROFILE] Role: ${profile?.role}`);

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '7d' }
        );

        console.log('[LOGIN] Sending response...');
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.full_name,
                role: profile?.role || 'pending'
            }
        });
    } catch (error: any) {
        console.error('[LOGIN ERROR]', error);
        res.status(500).json({ message: error.message });
    }
};

// Get current user
export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await User.findById((req as any).user.id).select('-password');
        const profile = await Profile.findOne({ user_id: (req as any).user.id });

        res.json({
            id: user?._id,
            email: user?.email,
            full_name: user?.full_name,
            role: profile?.role || 'pending'
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
