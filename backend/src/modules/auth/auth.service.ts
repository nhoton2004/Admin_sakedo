import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { Role } from '../../common/enums';
import { AppError } from '../../common/middleware/error.middleware';
import { PasswordUtils } from '../../common/utils/password.utils';
import { LoginDto } from './auth.dto';
import { AuthRepository } from './auth.repository';

/**
 * Service for authentication business logic
 */
export class AuthService {
    private repository: AuthRepository;

    constructor() {
        this.repository = new AuthRepository();
    }

    /**
     * Login with email and password
     */
    public async login(dto: LoginDto): Promise<{ accessToken: string; user: any }> {
        const user = await this.repository.findByEmail(dto.email);

        if (!user) {
            throw new AppError(401, 'Invalid credentials');
        }

        if (!user.isActive) {
            throw new AppError(403, 'Account is deactivated');
        }

        const isPasswordValid = await PasswordUtils.compare(
            dto.password,
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new AppError(401, 'Invalid credentials');
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            config.jwtSecret,
            { expiresIn: config.jwtExpiresIn as any }
        );

        // Return user without password hash
        const userObj = user.toObject();
        const { passwordHash, ...userWithoutPassword } = userObj;

        return {
            accessToken,
            user: userWithoutPassword,
        };
    }

    /**
     * Get current user by ID
     */
    public async getCurrentUser(userId: string): Promise<any> {
        const user = await this.repository.findById(userId);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        const userObj = user.toObject();
        const { passwordHash, ...userWithoutPassword } = userObj;
        return userWithoutPassword;
    }
}
