const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkReservationCollections() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        const reservationsCount = await db.collection('reservations').countDocuments();
        const bookingsCount = await db.collection('bookings').countDocuments();

        console.log(`\n📊 Collection Counts:`);
        console.log(`  - reservations: ${reservationsCount}`);
        console.log(`  - bookings: ${bookingsCount}`);

        if (reservationsCount > 0) {
            console.log('\n📄 Sample from reservations:');
            const res = await db.collection('reservations').findOne();
            console.log(JSON.stringify(res, null, 2));
        }

        if (bookingsCount > 0) {
            console.log('\n📄 Sample from bookings:');
            const book = await db.collection('bookings').findOne();
            console.log(JSON.stringify(book, null, 2));
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkReservationCollections();
