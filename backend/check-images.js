const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') });

async function queryProducts() {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to:', uri.substring(0, 50) + '...');

        await mongoose.connect(uri);
        const db = mongoose.connection.db;

        const total = await db.collection('products').countDocuments();
        const active = await db.collection('products').countDocuments({ isActive: true });
        const inactive = await db.collection('products').countDocuments({ isActive: false });
        const withImages = await db.collection('products').countDocuments({ imageUrl: { $exists: true, $ne: '' } });
        const activeWithImages = await db.collection('products').countDocuments({ isActive: true, imageUrl: { $exists: true, $ne: '' } });
        const activeWithoutImages = await db.collection('products').countDocuments({ isActive: true, $or: [{ imageUrl: { $exists: false } }, { imageUrl: '' }, { imageUrl: null }] });

        console.log('\n📊 Database Statistics:');
        console.log(`Total products: ${total}`);
        console.log(`Active products: ${active}`);
        console.log(`Inactive products: ${inactive}`);
        console.log(`Products with images (total): ${withImages}`);
        console.log(`ACTIVE products WITH images: ${activeWithImages}`);
        console.log(`ACTIVE products WITHOUT images: ${activeWithoutImages}`);

        // Sample active products
        const samples = await db.collection('products').find({ isActive: true }).limit(5).toArray();
        console.log('\n📦 Sample ACTIVE Products:');
        samples.forEach(p => {
            console.log(`- "${p.name}": imageUrl = "${p.imageUrl || 'NONE'}"`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

queryProducts();
