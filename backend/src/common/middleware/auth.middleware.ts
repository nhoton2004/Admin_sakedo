import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { Role } from '../enums';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: Role;
    };
}

export class AuthMiddleware {
    /**
     * Verify JWT token and attach user to request
     */
    public static verifyToken(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): void {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            const token = authHeader.substring(7);

            const decoded = jwt.verify(token, config.jwtSecret) as {
                id: string;
                email: string;
                role: Role;
            };

            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid or expired token' });
        }
    }

    /**
     * Check if user has required role
     */
    public static requireRole(...roles: Role[]) {
        return (req: AuthRequest, res: Response, next: NextFunction): void => {
            if (!req.user) {
                res.status(401).json({ message: 'Authentication required' });
                return;
            }

            if (!roles.includes(req.user.role)) {
                res.status(403).json({ message: 'Insufficient permissions' });
                return;
            }

            next();
        };
    }

    /**
     * Admin-only middleware
     */
    public static requireAdmin(
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ): void {
        AuthMiddleware.requireRole(Role.ADMIN)(req, res, next);
    }
}
