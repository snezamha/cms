import { z } from 'zod';

export const productSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, {
      message: 'Name must contain at least 3 character(s)',
    })
    .max(50, {
      message: 'Name must contain at most 50 character(s)',
    }),
  description: z
    .string()
    .max(500, {
      message: 'Description must contain at most 500 character(s)',
    })
    .optional(),
  price: z.coerce
    .number({
      required_error: 'Price must be filled',
    })
    .min(1000000, {
      message: 'Price must be greater than or equal to 1,000,000 Rial',
    }),
  category: z.string().nullable().optional(),
  images: z
    .object({
      fileKey: z.string(),
      fileName: z.string(),
      fileSize: z.number(),
      fileUrl: z.string(),
      key: z.string(),
      name: z.string(),
      size: z.number(),
      url: z.string(),
    })
    .array()
    .optional(),
});

export type productPayload = z.infer<typeof productSchema>;
