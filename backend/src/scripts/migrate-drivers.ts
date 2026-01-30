
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define Legacy Driver Schema
const LegacyDriverSchema = new mongoose.Schema({
    username: String,
    password: String, // Plain text in legacy
    name: String,
    phone: String,
    vehiclePlate: String,
    area: String,
    status: String,
    email: String,
    rating: Number,
    totalEarnings: Number,
    dailyEarnings: Number,
    failedOrders: Number,
    avatar: String
}, { collection: 'drivers' });

const LegacyDriver = mongoose.model('LegacyDriver', LegacyDriverSchema);

// Define User Schema (Simplified version of src/models/User.model.ts)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'USER' },
    isActive: { type: Boolean, default: true },
    phone: String,
    vehiclePlate: String,
    area: String,
    driverStatus: String,
    rating: Number,
    totalOrders: Number,
    totalEarnings: Number,
    avatar: String
}, { collection: 'users', timestamps: true });

const User = mongoose.model('User', UserSchema);

async function migrate() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        console.log('📥 Reading legacy drivers...');
        const drivers = await LegacyDriver.find({});
        console.log(`Found ${drivers.length} drivers in legacy 'drivers' collection`);

        for (const driver of drivers) {
            const email = driver.email || `${driver.username}@example.com`; // Fallback if email missing

            // Check if user exists
            const existing = await User.findOne({ email });
            if (existing) {
                console.log(`⚠️  User ${email} already exists. Skipping.`);
                continue;
            }

            console.log(`➕ Migrating driver: ${driver.name} (${email})`);

            // Hash password
            const password = driver.password || '123456';
            const passwordHash = await bcrypt.hash(password, 10);

            // Map Status
            let driverStatus = 'OFFLINE';
            if (driver.status === 'AVAILABLE') driverStatus = 'AVAILABLE';

            await User.create({
                name: driver.name || 'Unknown Driver',
                email: email,
                passwordHash: passwordHash,
                role: 'DRIVER',
                isActive: true, // Assuming active if in system
                phone: driver.phone || '',
                vehiclePlate: driver.vehiclePlate || '',
                area: driver.area || '',
                driverStatus: driverStatus,
                rating: driver.rating || 5,
                totalEarnings: driver.totalEarnings || 0,
                avatar: driver.avatar || ''
            });
            console.log(`✅ Migrated ${driver.name} successfully`);
        }

        console.log('🎉 Migration completed successfully!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
