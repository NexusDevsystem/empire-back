import { Request, Response } from 'express';
import User from '../models/User';
import Profile from '../models/Profile';

// Get all employees (users + profiles)
export const getAllEmployees = async (req: Request, res: Response) => {
    try {
        const profiles = await Profile.find();

        // Fetch user details for each profile
        const employees = await Promise.all(profiles.map(async (profile) => {
            const user = await User.findById(profile.user_id).select('-password');
            if (!user) return null;

            return {
                id: user._id, // User ID as canonical ID
                profileId: profile._id,
                name: user.full_name,
                email: user.email,
                role: profile.role,
                avatar_url: profile.avatar_url,
                created_at: user.created_at
            };
        }));

        // Filter out nulls (orphaned profiles)
        res.json(employees.filter(e => e !== null));
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update employee role
export const updateEmployeeRole = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // User ID
        const { role } = req.body;

        const profile = await Profile.findOne({ user_id: id });
        if (!profile) {
            return res.status(404).json({ message: 'Funcionário não encontrado' });
        }

        profile.role = role;
        await profile.save();

        res.json({ message: 'Permissão atualizada com sucesso', role: profile.role });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete employee
export const deleteEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // User ID

        // Check if deleting self
        if ((req as any).user.id === id) {
            return res.status(400).json({ message: 'Você não pode excluir sua própria conta' });
        }

        await Profile.findOneAndDelete({ user_id: id });
        await User.findByIdAndDelete(id);

        res.json({ message: 'Funcionário removido com sucesso' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
