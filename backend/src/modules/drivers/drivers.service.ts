import { User, IUser } from '../../models';
import { AppError } from '../../common/middleware/error.middleware';
import * as bcrypt from 'bcrypt';

export class DriverService {
    /**
     * Get all drivers
     */
    static async getAll() {
        return User.find({ role: 'DRIVER' }).select('-passwordHash').sort({ createdAt: -1 });
    }

    /**
     * Create new driver
     */
    static async create(data: any) {
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            throw new AppError(400, 'Email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const driver = await User.create({
            ...data,
            passwordHash,
            role: 'DRIVER',
            driverStatus: 'OFFLINE',
            rating: 5,
            totalOrders: 0,
            totalEarnings: 0
        });

        const { passwordHash: _, ...driverData } = driver.toObject();
        return driverData;
    }

    /**
     * Update driver
     */
    static async update(id: string, data: any) {
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
    static async getStats() {
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
