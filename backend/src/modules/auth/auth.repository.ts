import { User } from '@prisma/client';
import { prisma } from '../../config/database';

/**
 * Repository for User database operations
 */
export class AuthRepository {
    /**
     * Find user by email
     */
    public async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Find user by ID
     */
    public async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}
