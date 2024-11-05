import { z } from 'zod';

export const CategorySchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(),
    name: z.string().min(1, t('categoryNameRequired')),
    type: z.enum(['blog', 'product']),
    parentId: z.string().optional().nullable(),
  });
};
