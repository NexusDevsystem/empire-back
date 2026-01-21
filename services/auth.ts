import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Profile from '../models/Profile';
import { connectDB } from './mongodb';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'empire-trajes-finos-secret-key-2026';

export interface AuthUser {
    id: string;
    email: string;
    full_name: string;
    role: string;
}

export const register = async (email: string, password: string, full_name: string) => {
    await connectDB();

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
        throw new Error('Email já cadastrado');
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
        role: 'pending' // Default role
    });

    return { id: user._id.toString(), email: user.email, full_name: user.full_name };
};

export const login = async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
    await connectDB();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Email ou senha incorretos');
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Email ou senha incorretos');
    }

    // Get profile
    const profile = await Profile.findOne({ user_id: user._id });

    // Generate token
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
    );

    return {
        token,
        user: {
            id: user._id.toString(),
            email: user.email,
            full_name: user.full_name,
            role: profile?.role || 'pending'
        }
    };
};

export const verifyToken = (token: string): { id: string; email: string } => {
    try {
        return jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    } catch {
        throw new Error('Token inválido');
    }
};

export const getUserFromToken = async (token: string): Promise<AuthUser | null> => {
    try {
        const decoded = verifyToken(token);
        await connectDB();

        const user = await User.findById(decoded.id);
        if (!user) return null;

        const profile = await Profile.findOne({ user_id: user._id });

        return {
            id: user._id.toString(),
            email: user.email,
            full_name: user.full_name,
            role: profile?.role || 'pending'
        };
    } catch {
        return null;
    }
};
