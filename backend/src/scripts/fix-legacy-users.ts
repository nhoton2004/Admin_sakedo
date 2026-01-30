
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
    role: { type: String, default: 'USER' },
    isActive: { type: Boolean, default: true }
}, { collection: 'users', strict: false }); // strict: false allows us to update documents with existing fields we haven't defined

const User = mongoose.model('User', UserSchema);

async function fixLegacyUsers() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        console.log('🔍 creating search for users without role...');

        // Find users where role is missing or null
        const legacyUsers = await User.find({
            $or: [
                { role: { $exists: false } },
                { role: null }
            ]
        });

        console.log(`Found ${legacyUsers.length} legacy users without role`);

        for (const user of legacyUsers) {
            console.log(`🛠️ Updating user ${user._id}...`);
            await User.updateOne(
                { _id: user._id },
                {
                    $set: {
                        role: 'USER',
                        isActive: true
                    }
                }
            );
        }

        console.log('🎉 Fixed all legacy users successfully!');

    } catch (error) {
        console.error('❌ Fix failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixLegacyUsers();
