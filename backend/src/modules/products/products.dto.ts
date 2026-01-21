import { z } from 'zod';

export const CreateProductSchema = z.object({
    categoryId: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().positive('Price must be positive'),
    imageUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
});

export const UpdateProductSchema = z.object({
    categoryId: z.string().min(1, 'Category is required').optional(),
    name: z.string().min(1, 'Name is required').optional(),
    description: z.string().min(1, 'Description is required').optional(),
    price: z.number().positive('Price must be positive').optional(),
    imageUrl: z.string().optional(),
    isFeatured: z.boolean().optional(),
});

export type CreateProductDto = z.infer<typeof CreateProductSchema>;
export type UpdateProductDto = z.infer<typeof UpdateProductSchema>;

export interface ProductFilters {
    search?: string;
    categoryId?: string;
    isActive?: boolean;
}
