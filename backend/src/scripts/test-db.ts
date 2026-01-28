import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env explicitly
const envPath = path.join(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

const uri = process.env.MONGODB_URI;

console.log('--- MongoDB Connection Test ---');
console.log('MONGODB_URI found:', !!uri);

if (uri) {
    // Mask password for display
    const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
    console.log('Connection String:', maskedUri);
} else {
    console.error('❌ MONGODB_URI is missing!');
    process.exit(1);
}

async function testConnection() {
    try {
        console.log('Attempting to connect...');
        await mongoose.connect(uri!);
        console.log('✅ Connection SUCCESSFUL!');
        await mongoose.disconnect();
    } catch (error: any) {
        console.error('❌ Connection FAILED:', error.message);
        if (error.codeName === 'AtlasError') {
            console.error('👉 Hint: Check your username and password. If password has special characters (@, :, /), make sure they are URL encoded.');
        }
    }
}

testConnection();
