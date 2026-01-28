import { User, IUser } from '../../models';

/**
 * Repository for User database operations
 */
export class AuthRepository {
    /**
     * Find user by email
     */
    public async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email }).exec();
    }

    /**
     * Find user by ID
     */
    public async findById(id: string): Promise<IUser | null> {
        return User.findById(id).exec();
    }
}
