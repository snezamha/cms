import { z } from 'zod';

export const productSchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(),
    name: z
      .string({
        required_error: t('nameRequired'),
      })
      .min(3, { message: t('nameMin') })
      .max(50, { message: t('nameMax') }),
    description: z
      .string()
      .max(500, { message: t('descriptionMax') })
      .optional(),
    price: z
      .string({
        required_error: t('priceRequired'),
      })
      .refine((val) => val === '' || /^[0-9]+$/.test(val), {
        message: t('priceMinOrZero'),
      })
      .optional()
      .default('0'),
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
    countInStock: z
      .string({
        required_error: t('countInStockRequired'),
      })
      .refine((val) => val === '' || /^[0-9]+$/.test(val), {
        message: t('countInStockPositiveOrZero'),
      })
      .optional()
      .default('0'),
    discountPercent: z
      .string()
      .refine((val) => val === '' || /^[1-9][0-9]*$/.test(val), {
        message: t('discountPercentPositive'),
      })
      .optional()
      .default('0'),
    isInAuction: z.boolean().default(false),
    status: z.boolean().default(true),
  });
};

export type productPayload = z.infer<ReturnType<typeof productSchema>>;
