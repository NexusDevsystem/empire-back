import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Profile from '../models/Profile';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Não autorizado - Token não fornecido' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            (req as any).user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Não autorizado - Token inválido' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

export const authorize = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = (req as any).user.id;
            const profile = await Profile.findOne({ user_id: userId });

            if (!profile || !roles.includes(profile.role)) {
                return res.status(403).json({
                    message: `O seu cargo (${profile?.role || 'indefinido'}) não tem permissão para realizar esta ação.`
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Erro ao verificar permissões' });
        }
    };
};
