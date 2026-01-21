import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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
