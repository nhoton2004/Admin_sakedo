import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: string | number;
    jwtSecret: string;
    jwtExpiresIn: string | number;
    nodeEnv: string;
}

export const config: Config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    nodeEnv: process.env.NODE_ENV || 'development',
};
