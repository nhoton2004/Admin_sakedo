import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { User } from '../models/User.model';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { connectDatabase } from '../config/database';

async function seed() {
    console.log('🌱 Starting seed...');

    try {
        await connectDatabase();

        // Create admin user
        const adminEmail = 'admin@akedo.local';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const passwordHash = await bcrypt.hash('Admin@123', 10);
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN',
                isActive: true,
            });
            console.log('✅ Created admin user:', adminEmail);
        } else {
            console.log('ℹ️ Admin user already exists');
        }

        // Create categories
        const categoriesData = [
            { name: 'Beverages', isActive: true },
            { name: 'Main Dishes', isActive: true },
            { name: 'Desserts', isActive: true },
        ];

        const createdCategories = [];

        for (const catData of categoriesData) {
            let category = await Category.findOne({ name: catData.name });
            if (!category) {
                category = await Category.create(catData);
                console.log(`✅ Created category: ${category.name}`);
            }
            createdCategories.push(category);
        }

        // Create products
        const beverages = createdCategories.find(c => c.name === 'Beverages');
        const mainDishes = createdCategories.find(c => c.name === 'Main Dishes');
        const desserts = createdCategories.find(c => c.name === 'Desserts');

        if (beverages && mainDishes && desserts) {
            const productsData = [
                {
                    categoryId: beverages._id,
                    name: 'Vietnamese Coffee',
                    description: 'Traditional Vietnamese iced coffee',
                    price: 3.5,
                    imageUrl: 'https://via.placeholder.com/300x200?text=Coffee',
                    isActive: true,
                    isFeatured: true,
                },
                {
                    categoryId: beverages._id,
                    name: 'Fresh Orange Juice',
                    description: 'Freshly squeezed orange juice',
                    price: 4.0,
                    imageUrl: 'https://via.placeholder.com/300x200?text=Orange+Juice',
                    isActive: true,
                    isFeatured: false,
                },
                {
                    categoryId: mainDishes._id,
                    name: 'Pho Bo',
                    description: 'Vietnamese beef noodle soup',
                    price: 8.5,
                    imageUrl: 'https://via.placeholder.com/300x200?text=Pho+Bo',
                    isActive: true,
                    isFeatured: true,
                },
                {
                    categoryId: mainDishes._id,
                    name: 'Banh Mi',
                    description: 'Vietnamese sandwich',
                    price: 5.5,
                    imageUrl: 'https://via.placeholder.com/300x200?text=Banh+Mi',
                    isActive: true,
                    isFeatured: false,
                },
                {
                    categoryId: desserts._id,
                    name: 'Che Ba Mau',
                    description: 'Three-color dessert',
                    price: 4.5,
                    imageUrl: 'https://via.placeholder.com/300x200?text=Che',
                    isActive: true,
                    isFeatured: false,
                },
            ];

            for (const prodData of productsData) {
                const existingProduct = await Product.findOne({ name: prodData.name });
                if (!existingProduct) {
                    await Product.create(prodData);
                    console.log(`✅ Created product: ${prodData.name}`);
                }
            }
        }

        // Create sample driver
        const driverEmail = 'driver@akedo.local';
        const existingDriver = await User.findOne({ email: driverEmail });

        if (!existingDriver) {
            const driverPasswordHash = await bcrypt.hash('Driver@123', 10);
            await User.create({
                name: 'John Driver',
                email: driverEmail,
                passwordHash: driverPasswordHash,
                role: 'DRIVER',
                isActive: true,
            });
            console.log('✅ Created driver:', driverEmail);
        }

        console.log('🎉 Seed completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
