import { IUser } from '../../models';
import { IRepository } from './IRepository';

/**
 * User Repository Interface
 * Extends base repository with user-specific operations
 */
export interface IUserRepository extends IRepository<IUser> {
    /**
     * Find user by email
     */
    findByEmail(email: string): Promise<IUser | null>;

    /**
     * Find users by role
     */
    findByRole(role: string): Promise<IUser[]>;

    /**
     * Toggle user active status
     */
    toggleActive(id: string, isActive: boolean): Promise<IUser | null>;
}
