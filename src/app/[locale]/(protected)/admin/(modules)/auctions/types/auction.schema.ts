import { z } from 'zod';

export const AuctionSchema = (t: (key: string) => string) => {
  return z.object({
    id: z.string().optional(), 
    title: z.string().min(1, t('auctionTitleRequired')), 
    productIds: z.array(z.string()).nonempty(t('productIdsRequired')),
    endAt: z.string().min(1, t('endAtRequired')), 
    status: z.boolean().default(false), 
  });
};
