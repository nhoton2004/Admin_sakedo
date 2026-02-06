import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function checkConnection() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('🔍 Checking MongoDB connection...');
        console.log('📝 MONGODB_URI from .env:', uri);

        if (!uri) {
            console.error('❌ MONGODB_URI not found in environment!');
            process.exit(1);
        }

        // Extract database name from URI
        const dbName = uri.split('/')[3]?.split('?')[0];
        console.log('📦 Database name:', dbName);

        await mongoose.connect(uri);
        console.log('✅ Connected successfully!');

        // Get actual connected database
        const connectedDb = mongoose.connection.db.databaseName;
        console.log('💾 Actually connected to database:', connectedDb);

        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📚 Collections in this database:');
        collections.forEach(col => console.log(`  - ${col.name}`));

        // Check drivers collection
        const driversCount = await mongoose.connection.db.collection('drivers').countDocuments();
        console.log(`\n👤 Total drivers in collection: ${driversCount}`);

        // Get sample driver
        const sampleDriver = await mongoose.connection.db.collection('drivers').findOne({});
        console.log('\n📄 Sample driver:', JSON.stringify(sampleDriver, null, 2));

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkConnection();
