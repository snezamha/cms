import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['blog', 'product', 'news']),
  parentId: z.string().optional().nullable(),
});
