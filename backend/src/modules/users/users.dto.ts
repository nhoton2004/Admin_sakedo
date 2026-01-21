import { z } from 'zod';

export const CreateUserSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['DRIVER']).default('DRIVER'), // Admin can only create drivers
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export interface UserFilters {
    role?: string;
}
