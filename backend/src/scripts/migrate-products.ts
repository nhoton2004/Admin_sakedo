
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Legacy Product Schema
const LegacyProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: String, // "steak"
    discount: Number,
    isBestSeller: Boolean
}, { collection: 'products', strict: false });

const LegacyProduct = mongoose.model('LegacyProduct', LegacyProductSchema);

// New Schemas
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { collection: 'categories', timestamps: true });
const Category = mongoose.model('Category', CategorySchema);

const ProductSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: String,
    description: String,
    price: Number,
    imageUrl: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false }
}, { collection: 'products', timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

async function migrateProducts() {
    console.log('🔄 Connecting to MongoDB...');
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is undefined');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    try {
        console.log('📥 Reading products...');
        const products = await LegacyProduct.find({});
        console.log(`Found ${products.length} products`);

        for (const p of products) {
            // 1. Handle Category
            const categoryName = p.category || 'Uncategorized';
            let category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, 'i') } });

            if (!category) {
                console.log(`🆕 Creating category: ${categoryName}`);
                category = await Category.create({ name: categoryName, isActive: true });
            }

            // 2. Prepare Update Data
            const updates: any = {};

            // Map category -> categoryId
            if (category) {
                updates.categoryId = category._id;
            }

            // Map image -> imageUrl
            if (p.image && !p.get('imageUrl')) {
                // If it's a relative path/filename, maybe prefix it or leave it?
                // The frontend likely expects a full URL or relative path. 
                // Legacy example: "banhxeo.png".
                // I'll assume they are in /assets/ or served statically.
                updates.imageUrl = p.image;
            }

            // Map isBestSeller -> isFeatured
            if (p.isBestSeller !== undefined) {
                updates.isFeatured = p.isBestSeller;
            }

            // Updates
            if (Object.keys(updates).length > 0) {
                await Product.updateOne({ _id: p._id }, { $set: updates });
                console.log(`✅ Updated product: ${p.name}`);
            }
        }

        // Cleanup: remove legacy fields if we want? 
        // For now, keeping them doesn't hurt, but "category" string might confuse if checked manually.
        // We'll leave them.

        console.log('🎉 Product migration completed!');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrateProducts();
