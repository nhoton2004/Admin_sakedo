import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { Product } from '../models/Product.model';
import { connectDatabase } from '../config/database';

// Vietnamese food images from Unsplash
const foodImages = [
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop', // Pho
    'https://images.unsplash.com/photo-1559847844-5315695497f1?w=300&h=200&fit=crop', // Vietnamese food
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop', // Banh mi
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop', // Asian food
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=300&h=200&fit=crop', // Rice dish
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop', // Salad/fresh food
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop', // Pancakes
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop', // Dessert
    'https://images.unsplash.com/photo-1563897539-7951e24e44ca?w=300&h=200&fit=crop', // Noodles
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=200&fit=crop', // Grilled food
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=200&fit=crop', // Burger/sandwich
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop', // Soup
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop', // Bowl food
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=200&fit=crop', // Pizza
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop', // Fried chicken
    'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop', // Orange juice
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop', // Coffee
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop', // Tea
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&h=200&fit=crop', // Smoothie
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=200&fit=crop', // Coffee art
];

async function updateProductImages() {
    console.log('🖼️  Starting product image update...');

    try {
        await connectDatabase();

        // Find all ACTIVE products without images
        const productsWithoutImages = await Product.find({
            isActive: true, // Only update active products
            $or: [
                { imageUrl: { $exists: false } },
                { imageUrl: null },
                { imageUrl: '' }
            ]
        });

        console.log(`Found ${productsWithoutImages.length} products without images`);

        if (productsWithoutImages.length === 0) {
            console.log('✅ All products already have images!');
            process.exit(0);
        }

        // Update each product with a random food image
        let updated = 0;
        for (const product of productsWithoutImages) {
            // Use a deterministic image based on product name hash
            // This ensures same product always gets same image
            const nameHash = product.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const imageIndex = nameHash % foodImages.length;
            const imageUrl = foodImages[imageIndex];

            await Product.findByIdAndUpdate(product._id, { imageUrl });
            console.log(`✅ Updated "${product.name}" with image`);
            updated++;
        }

        console.log(`🎉 Successfully updated ${updated} products with images!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error updating product images:', error);
        process.exit(1);
    }
}

updateProductImages();
