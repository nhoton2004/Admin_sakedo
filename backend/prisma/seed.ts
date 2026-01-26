import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Create admin user
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@akedo.local' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@akedo.local',
            passwordHash,
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('✅ Created admin user:', admin.email);

    // Create sample categories
    /*
    const beverages = await prisma.category.create({
        data: {
            name: 'Beverages',
            isActive: true,
        },
    });

    const mainDishes = await prisma.category.create({
        data: {
            name: 'Main Dishes',
            isActive: true,
        },
    });

    const desserts = await prisma.category.create({
        data: {
            name: 'Desserts',
            isActive: true,
        },
    });

    console.log('✅ Created categories');

    // Create sample products
    await prisma.product.createMany({
        data: [
            {
                categoryId: beverages.id,
                name: 'Vietnamese Coffee',
                description: 'Traditional Vietnamese iced coffee',
                price: 3.5,
                imageUrl: 'https://via.placeholder.com/300x200?text=Coffee',
                isActive: true,
                isFeatured: true,
            },
            {
                categoryId: beverages.id,
                name: 'Fresh Orange Juice',
                description: 'Freshly squeezed orange juice',
                price: 4.0,
                imageUrl: 'https://via.placeholder.com/300x200?text=Orange+Juice',
                isActive: true,
                isFeatured: false,
            },
            {
                categoryId: mainDishes.id,
                name: 'Pho Bo',
                description: 'Vietnamese beef noodle soup',
                price: 8.5,
                imageUrl: 'https://via.placeholder.com/300x200?text=Pho+Bo',
                isActive: true,
                isFeatured: true,
            },
            {
                categoryId: mainDishes.id,
                name: 'Banh Mi',
                description: 'Vietnamese sandwich',
                price: 5.5,
                imageUrl: 'https://via.placeholder.com/300x200?text=Banh+Mi',
                isActive: true,
                isFeatured: false,
            },
            {
                categoryId: desserts.id,
                name: 'Che Ba Mau',
                description: 'Three-color dessert',
                price: 4.5,
                imageUrl: 'https://via.placeholder.com/300x200?text=Che',
                isActive: true,
                isFeatured: false,
            },
        ],
    });

    console.log('✅ Created products');

    // Create sample driver
    const driverPasswordHash = await bcrypt.hash('Driver@123', 10);

    const driver = await prisma.user.create({
        data: {
            name: 'John Driver',
            email: 'driver@akedo.local',
            passwordHash: driverPasswordHash,
            role: 'DRIVER',
            isActive: true,
        },
    });

    console.log('✅ Created driver:', driver.email);
    */

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
