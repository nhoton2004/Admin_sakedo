
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define Legacy Booking Schema
const LegacyBookingSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    bookingDate: String, // from inspection: "2026-01-16T11:30:00.000Z"
    guestCount: Number,
    status: String,
    // note: String // didn't see note in inspection, but keeping optional
}, { collection: 'bookings', strict: false });

const LegacyBooking = mongoose.model('LegacyBooking', LegacyBookingSchema);

// Define New Reservation Schema
const ReservationSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    datetime: { type: Date, required: true },
    guests: { type: Number, required: true },
    note: String,
    status: { type: String, default: 'NEW' }
}, { collection: 'reservations', timestamps: true });

const Reservation = mongoose.model('Reservation', ReservationSchema);

async function migrateBookings() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        // Cleanup previous failed run (where customerName was 'Unknown Guest')
        console.log('🧹 Cleaning up invalid migrations...');
        const deleteResult = await Reservation.deleteMany({ customerName: 'Unknown Guest' });
        console.log(`Deleted ${deleteResult.deletedCount} invalid records`);

        // Also clean up undefined/nulls if any
        // Also clean up undefined/nulls if any
        // @ts-ignore
        const deleteResult2 = await Reservation.deleteMany({ customerName: { $in: [null, undefined] } });
        console.log(`Deleted ${deleteResult2.deletedCount} null records`);


        console.log('📥 Reading legacy bookings...');
        const bookings = await LegacyBooking.find({});
        console.log(`Found ${bookings.length} legacy bookings`);

        for (const booking of bookings) {
            // Parse Date
            let datetime = new Date();
            if (booking.bookingDate) {
                datetime = new Date(booking.bookingDate);
            }

            if (isNaN(datetime.getTime())) {
                console.log(`⚠️ Invalid date for ${booking._id}, using now`);
                datetime = new Date();
            }

            // Map Status
            let status = 'NEW';
            const s = (booking.status || '').toLowerCase();
            if (s === 'confirmed' || s === 'accept') status = 'CONFIRMED';
            if (s === 'completed' || s === 'done') status = 'COMPLETED';
            if (s === 'cancelled' || s === 'cancel') status = 'CANCELED';
            if (s === 'pending') status = 'NEW';

            const name = booking.fullName || 'Unknown';
            if (name === 'Unknown') {
                // Try to check if we can interpret something else, but inspection showed fullName
            }

            console.log(`➕ Migrating booking for: ${name}`);

            // Check duplicate
            const exists = await Reservation.findOne({
                customerName: name,
                datetime: datetime
            });

            if (!exists) {
                await Reservation.create({
                    customerName: name,
                    phone: booking.phone || '',
                    datetime: datetime,
                    guests: booking.guestCount || 2,
                    note: '', // No note field seen in legacy
                    status: status
                });
            } else {
                console.log(`⏩ Skipping duplicate: ${name}`);
            }
        }

        console.log('🎉 Migration of bookings completed!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateBookings();
