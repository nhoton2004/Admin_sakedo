import { z } from 'zod';

export interface OrderFilters {
    status?: string;
}

export const AssignDriverSchema = z.object({
    driverId: z.string().min(1, 'Driver ID is required'),
});

export type AssignDriverDto = z.infer<typeof AssignDriverSchema>;
