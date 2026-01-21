import { z } from 'zod';

export const UpdateAboutDto = z.object({
    heading: z.string().min(1, 'Heading is required'),
    content: z.string().min(1, 'Content is required'),
    imageUrl: z.string().url('Must be a valid URL').optional(),
});

export type UpdateAboutInput = z.infer<typeof UpdateAboutDto>;
