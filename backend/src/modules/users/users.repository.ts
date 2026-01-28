import { User, IUser } from '../../models';
import { CreateUserDto, UserFilters } from './users.dto';

/**
 * Repository for User database operations
 */
export class UsersRepository {
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
     * Create user
     */
    public async create(data: {
        name: string;
        email: string;
        passwordHash: string;
        role: 'ADMIN' | 'DRIVER' | 'USER';
    }): Promise<IUser> {
        const user = new User(data);
        return user.save();
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
}
