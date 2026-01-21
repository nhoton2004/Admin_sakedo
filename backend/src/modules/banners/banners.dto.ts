import { z } from 'zod';

export const CreateBannerDto = z.object({
    title: z.string().min(1, 'Title is required'),
    subtitle: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL'),
    ctaText: z.string().optional(),
    ctaLink: z.string().optional(),
    order: z.number().int().min(0).default(0),
});

export const UpdateBannerDto = CreateBannerDto.partial();

export const ReorderBannersDto = z.array(
    z.object({
        id: z.string().uuid(),
        order: z.number().int().min(0),
    })
);

export type CreateBannerInput = z.infer<typeof CreateBannerDto>;
export type UpdateBannerInput = z.infer<typeof UpdateBannerDto>;
export type ReorderBannersInput = z.infer<typeof ReorderBannersDto>;
