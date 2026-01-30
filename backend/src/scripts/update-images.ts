import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

import { Product } from '../models/Product.model';
import { connectDatabase } from '../config/database';

async function updateImages() {
    console.log('🖼️  Updating product images...');

    try {
        await connectDatabase();

        const imageMap = {
            'Vietnamese Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=200&fit=crop',
            'Fresh Orange Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop',
            'Pho Bo': 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=300&h=200&fit=crop',
            'Banh Mi': 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=300&h=200&fit=crop',
            'Che Ba Mau': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
            'Che Ba Mau - UPDATED': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop'
        };

        for (const [productName, imageUrl] of Object.entries(imageMap)) {
            const result = await Product.updateMany(
                { name: productName },
                { $set: { imageUrl } }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} product(s): ${productName}`);
            } else {
                console.log(`ℹ️  No match for: ${productName}`);
            }
        }

        // Update all remaining placeholder images
        const placeholderResult = await Product.updateMany(
            { imageUrl: { $regex: 'via.placeholder.com' } },
            { $set: { imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop' } }
        );

        if (placeholderResult.modifiedCount > 0) {
            console.log(`✅ Updated ${placeholderResult.modifiedCount} remaining placeholder images`);
        }

        console.log('🎉 Image update completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Update error:', error);
        process.exit(1);
    }
}

updateImages();
