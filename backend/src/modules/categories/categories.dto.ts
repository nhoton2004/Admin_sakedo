import { z } from 'zod';

export const CreateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export const UpdateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
