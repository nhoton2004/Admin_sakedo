import { z } from 'zod';

export const UpdateVideoDto = z.object({
    videoUrl: z.string().url('Must be a valid URL'),
});

export type UpdateVideoInput = z.infer<typeof UpdateVideoDto>;
