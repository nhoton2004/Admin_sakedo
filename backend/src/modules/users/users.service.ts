import { IUser } from '../../models';
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
        return users.map((user) => {
            const userObj = user.toObject();
            const { passwordHash, ...rest } = userObj;
            return rest;
        });
    }

    /**
     * Create driver user
     */
    /**
     * Create user (DRIVER or USER)
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
            phone: (dto as any).phone, // Allow phone
            passwordHash,
            role: dto.role || Role.USER, // Use provided role
        });

        const userObj = user.toObject();
        const { passwordHash: _, ...userWithoutPassword } = userObj;
        return userWithoutPassword;
    }

    /**
     * Update user (name, phone, email, etc.)
     */
    public async update(id: string, data: any): Promise<any> {
        const user = await this.repository.findById(id);
        if (!user) throw new AppError(404, 'User not found');

        // Verify email uniqueness if changing email
        if (data.email && data.email !== user.email) {
            const existing = await this.repository.findByEmail(data.email);
            if (existing) throw new AppError(400, 'Email already used by another user');
        }

        // Update basic fields
        if (data.name) user.name = data.name;
        if (data.email) user.email = data.email;
        if (data.phone) user.phone = data.phone;

        // Update password if provided
        if (data.password) {
            user.passwordHash = await PasswordUtils.hash(data.password);
        }

        await user.save();

        const userObj = user.toObject();
        const { passwordHash, ...rest } = userObj;
        return rest;
    }

    /**
     * Delete user
     */
    public async delete(id: string): Promise<void> {
        const user = await this.repository.findById(id);
        if (!user) throw new AppError(404, 'User not found');

        await this.repository.delete(id);
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

        const updatedUserObj = updatedUser!.toObject();
        const { passwordHash, ...userWithoutPassword } = updatedUserObj;
        return userWithoutPassword;
    }
}
