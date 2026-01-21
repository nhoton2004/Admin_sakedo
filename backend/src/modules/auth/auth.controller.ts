import { Request, Response } from 'express';
import { AuthRequest } from '../../common/middleware/auth.middleware';
import { LoginSchema } from './auth.dto';
import { AuthService } from './auth.service';

/**
 * Controller for authentication endpoints
 */
export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    /**
     * POST /admin/auth/login
     */
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const validation = LoginSchema.safeParse(req.body);

            if (!validation.success) {
                res.status(400).json({
                    message: 'Validation failed',
                    details: validation.error.errors,
                });
                return;
            }

            const result = await this.service.login(validation.data);

            res.json(result);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Login failed',
            });
        }
    };

    /**
     * GET /admin/auth/me
     */
    public me = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Not authenticated' });
                return;
            }

            const user = await this.service.getCurrentUser(req.user.id);

            res.json(user);
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message || 'Failed to get user',
            });
        }
    };
}
