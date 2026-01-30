import { User, IUser } from '../../models';
import { AppError } from '../../common/middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../common/base';
import { IUserRepository } from '../../common/interfaces';
import { UsersRepository } from '../users/users.repository';

/**
 * Driver Service
 * Extends BaseService for common CRUD operations (Inheritance & OOP)
 */
export class DriverService extends BaseService<IUser> {
    protected repository: IUserRepository;

    constructor() {
        const repository = new UsersRepository();
        super(repository);
        this.repository = repository;
    }

    protected get entityName(): string {
        return 'Driver';
    }

    /**
     * Get all drivers
     */
    async getAll(): Promise<IUser[]> {
        return this.repository.findByRole('DRIVER');
    }

    /**
     * Create new driver
     */
    async create(data: any): Promise<any> {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError(400, 'Email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const driver = await this.repository.create({
            ...data,
            passwordHash,
            role: 'DRIVER',
            driverStatus: 'OFFLINE',
            rating: 5,
            totalOrders: 0,
            totalEarnings: 0
        });

        // Remove password hash from response
        const { passwordHash: _, ...driverData } = driver.toObject();
        return driverData;
    }

    /**
     * Update driver
     */
    async update(id: string, data: any): Promise<IUser> {
        const driver = await User.findOneAndUpdate(
            { _id: id, role: 'DRIVER' },
            data,
            { new: true }
        ).select('-passwordHash');

        if (!driver) {
            throw new AppError(404, 'Driver not found');
        }

        return driver;
    }

    /**
     * Get driver stats
     */
    async getStats(): Promise<any> {
        const stats = await User.aggregate([
            { $match: { role: 'DRIVER' } },
            {
                $group: {
                    _id: null,
                    totalDrivers: { $sum: 1 },
                    activeDrivers: {
                        $sum: { $cond: [{ $eq: ['$driverStatus', 'AVAILABLE'] }, 1, 0] }
                    },
                    totalEarnings: { $sum: '$totalEarnings' }
                }
            }
        ]);

        return stats[0] || { totalDrivers: 0, activeDrivers: 0, totalEarnings: 0 };
    }
}
