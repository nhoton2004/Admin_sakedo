const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function debugOrderCancel() {
    try {
        const uri = process.env.MONGODB_URI;
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB');

        const db = mongoose.connection.db;

        // 1. Get a sample order that is NOT completed/canceled
        // Trying to find one with legacy status "0", "1", "2"...
        const order = await db.collection('orders').findOne({
            status: { $nin: ['COMPLETED', 'CANCELED', 'CANCELLED'] }
        });

        if (!order) {
            console.log('Alert: No active orders found to test cancel.');
            process.exit(0);
        }

        console.log('📄 Found Order:', JSON.stringify(order, null, 2));

        // 2. Try to update it using Mongoose Model to simulate backend action
        console.log(`\n🔄 Attempting to cancel order ${order._id}...`);

        // Define simple schema to bypass full app logic but test Mongoose behavior
        const OrderSchema = new mongoose.Schema({
            status: { type: String }
        }, { collection: 'orders' });

        const OrderModel = mongoose.model('TestOrder', OrderSchema);

        const result = await OrderModel.findByIdAndUpdate(
            order._id,
            { status: 'CANCELED' },
            { new: true }
        );

        console.log('✅ Update Result:', result);

    } catch (error) {
        console.error('❌ Error during cancel test:', error);
    } finally {
        await mongoose.connection.close();
    }
}

debugOrderCancel();
