
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const LegacyProductSchema = new mongoose.Schema({}, { collection: 'products', strict: false });
const LegacyProduct = mongoose.model('LegacyProduct', LegacyProductSchema);

async function inspect() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        console.log('🔍 Fetching one legacy product...');
        const product = await LegacyProduct.findOne({});
        console.log(JSON.stringify(product, null, 2));

        console.log('🔍 Checking categories collection...');
        const cols = await mongoose.connection.db!.listCollections().toArray();
        console.log('Collections:', cols.map(c => c.name));

    } catch (error) {
        console.error('❌ Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

inspect();
