import { User, IUser } from '../../models';
import Driver from '../../models/Driver.model'; // Import Driver model
import { AppError } from '../../common/middleware/error.middleware';
import * as bcrypt from 'bcrypt';
import { BaseService } from '../../common/base';
import { IUserRepository } from '../../common/interfaces';
import { UsersRepository } from '../users/users.repository';

/**
 * Driver Service
 * Extends BaseService for common CRUD operations (Inheritance & OOP)
 * Managed Dual Write to both 'users' and 'drivers' collections
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
     * Create new driver - Dual Write to Users and Drivers collections
     */
    async create(data: any): Promise<any> {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError(400, 'Email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        // 1. Create in Users collection
        const driver = await this.repository.create({
            ...data,
            passwordHash,
            role: 'DRIVER',
            driverStatus: 'OFFLINE',
            rating: 5,
            totalOrders: 0,
            totalEarnings: 0
        });

        // 2. Create/Sync to Drivers collection (Legacy/App DB)
        try {
            await Driver.create({
                username: data.email.split('@')[0], // Generate username from email
                password: data.password, // Store raw password if needed by legacy app, or hash
                name: data.name,
                phone: data.phone,
                vehiclePlate: data.vehiclePlate,
                area: data.area,
                email: data.email,
                status: 'OFFLINE',
                rating: 5,
                totalEarnings: 0,
                dailyEarnings: 0,
                completedOrders: 0,
                failedOrders: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log(`✅ Synced new driver to 'drivers' collection: ${data.name}`);
        } catch (error) {
            console.error(`❌ Failed to sync driver to 'drivers' collection:`, error);
            // Non-blocking error - we still return the created user
        }

        // Remove password hash from response
        const { passwordHash: _, ...driverData } = driver.toObject();
        return driverData;
    }

    /**
     * Update driver - Dual Write
     */
    async update(id: string, data: any): Promise<IUser> {
        // 1. Update User
        const driver = await User.findOneAndUpdate(
            { _id: id, role: 'DRIVER' },
            data,
            { new: true }
        ).select('-passwordHash');

        if (!driver) {
            throw new AppError(404, 'Driver not found');
        }

        // 2. Sync Update to Drivers collection
        try {
            // Find by email or matching fields
            await Driver.updateOne(
                { email: driver.email },
                {
                    $set: {
                        name: data.name || driver.name,
                        phone: data.phone || driver.phone,
                        vehiclePlate: data.vehiclePlate || driver.vehiclePlate,
                        area: data.area || driver.area
                    }
                }
            );
            console.log(`✅ Synced update to 'drivers' collection: ${driver.name}`);
        } catch (error) {
            console.error(`❌ Failed to sync update to 'drivers' collection:`, error);
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

    /**
     * Toggle driver active status - Dual Write
     */
    async toggleActive(id: string): Promise<IUser> {
        const driver = await User.findOne({ _id: id, role: 'DRIVER' }).select('-passwordHash');

        if (!driver) {
            throw new AppError(404, 'Driver not found');
        }

        driver.isActive = !driver.isActive;
        // Also map isActive to driverStatus for consistency
        driver.driverStatus = driver.isActive ? 'AVAILABLE' : 'OFFLINE';

        await driver.save();

        // Sync status to Drivers collection
        try {
            await Driver.updateOne(
                { email: driver.email },
                { $set: { status: driver.driverStatus } }
            );
            console.log(`✅ Synced status to 'drivers' collection: ${driver.driverStatus}`);
        } catch (error) {
            console.error(`❌ Failed to sync status:`, error);
        }

        return driver;
    }

    /**
     * Delete driver - Dual Delete
     */
    async delete(id: string): Promise<void> {
        const driver = await User.findOne({ _id: id, role: 'DRIVER' });

        if (!driver) {
            throw new AppError(404, 'Driver not found');
        }

        // 1. Delete from Users
        await User.findByIdAndDelete(id);

        // 2. Delete from Drivers
        try {
            await Driver.deleteOne({ email: driver.email });
            console.log(`✅ Synced delete to 'drivers' collection: ${driver.email}`);
        } catch (error) {
            console.error(`❌ Failed to sync delete:`, error);
        }
    }
}
