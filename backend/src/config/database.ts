import { PrismaClient } from '@prisma/client';

// Singleton Prisma Client instance
class DatabaseService {
    private static instance: PrismaClient;

    private constructor() { }

    public static getInstance(): PrismaClient {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new PrismaClient({
                log: ['query', 'error', 'warn'],
            });
        }
        return DatabaseService.instance;
    }

    public static async disconnect(): Promise<void> {
        if (DatabaseService.instance) {
            await DatabaseService.instance.$disconnect();
        }
    }
}

export const prisma = DatabaseService.getInstance();
export { DatabaseService };
