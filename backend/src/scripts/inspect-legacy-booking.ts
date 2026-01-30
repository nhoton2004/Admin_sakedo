
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const LegacyBookingSchema = new mongoose.Schema({}, { collection: 'bookings', strict: false });
const LegacyBooking = mongoose.model('LegacyBooking', LegacyBookingSchema);

async function inspect() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        console.log('🔍 Fetching one legacy booking...');
        const booking = await LegacyBooking.findOne({});
        console.log(JSON.stringify(booking, null, 2));
    } catch (error) {
        console.error('❌ Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
