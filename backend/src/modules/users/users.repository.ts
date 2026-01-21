import { User, Role } from '@prisma/client';
import { prisma } from '../../config/database';
import { CreateUserDto, UserFilters } from './users.dto';

/**
 * Repository for User database operations
 */
export class UsersRepository {
    /**
     * Find all users with filters
     */
    public async findAll(filters: UserFilters): Promise<User[]> {
        const where: any = {};

        if (filters.role) {
            where.role = filters.role as Role;
        }

        return prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
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

    /**
     * Find user by email
     */
    public async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Create user
     */
    public async create(data: {
        name: string;
        email: string;
        passwordHash: string;
        role: Role;
    }): Promise<User> {
        return prisma.user.create({
            data,
        });
    }

    /**
     * Toggle active status
     */
    public async toggleActive(id: string, isActive: boolean): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: { isActive },
        });
    }
}
