import { User } from '@prisma/client';
import { AppError } from '../../common/middleware/error.middleware';
import { PasswordUtils } from '../../common/utils/password.utils';
import { CreateUserDto, UserFilters } from './users.dto';
import { UsersRepository } from './users.repository';
import { Role } from '../../common/enums';

/**
 * Service for user management business logic
 */
export class UsersService {
    private repository: UsersRepository;

    constructor() {
        this.repository = new UsersRepository();
    }

    /**
     * Get all users (typically drivers)
     */
    public async getAll(filters: UserFilters): Promise<any[]> {
        const users = await this.repository.findAll(filters);

        // Remove password hashes from response
        return users.map(({ passwordHash, ...user }) => user);
    }

    /**
     * Create driver user
     */
    public async create(dto: CreateUserDto): Promise<any> {
        // Check if email already exists
        const existingUser = await this.repository.findByEmail(dto.email);

        if (existingUser) {
            throw new AppError(400, 'Email already exists');
        }

        // Hash password
        const passwordHash = await PasswordUtils.hash(dto.password);

        const user = await this.repository.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
            role: Role.DRIVER,
        });

        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    /**
     * Toggle user active status
     */
    public async toggleActive(id: string): Promise<any> {
        const user = await this.repository.findById(id);

        if (!user) {
            throw new AppError(404, 'User not found');
        }

        const updatedUser = await this.repository.toggleActive(id, !user.isActive);

        const { passwordHash, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}
