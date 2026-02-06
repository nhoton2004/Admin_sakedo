import { User, IUser } from '../../models';
import { CreateUserDto, UserFilters } from './users.dto';
import { IUserRepository } from '../../common/interfaces';

/**
 * Repository for User database operations
 */
export class UsersRepository implements IUserRepository {
    /**
     * Find all users with filters
     */
    public async findAll(filters: UserFilters): Promise<IUser[]> {
        const query: any = {};

        if (filters.role) {
            query.role = filters.role;
        }

        return User.find(query).sort({ createdAt: -1 }).exec();
    }

    /**
     * Find user by ID
     */
    public async findById(id: string): Promise<IUser | null> {
        return User.findById(id).exec();
    }

    /**
     * Find user by email
     */
    public async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).exec();
    }

    /**
     * Find users by role
     */
    public async findByRole(role: string): Promise<IUser[]> {
        return User.find({ role }).select('-passwordHash').sort({ createdAt: -1 }).exec();
    }

    /**
     * Create user
     */
    /**
     * Create user
     */
    public async create(data: {
        name: string;
        email: string;
        phone?: string;
        passwordHash: string;
        role: 'ADMIN' | 'DRIVER' | 'USER';
    }): Promise<IUser> {
        const user = new User(data);
        return user.save();
    }

    /**
     * Delete user
     */
    public async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id).exec();
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<IUser | null> {
        return User.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        ).exec();
    }

    /**
     * Update user
     */
    public async update(id: string, data: any): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, data, { new: true }).exec();
    }
}
