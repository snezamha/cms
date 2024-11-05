'use server';
import { revalidatePath } from 'next/cache';
import db from '@/server/db';
import { AuctionSchema } from '../types/auction.schema';
import { actionClient } from '@/lib/admin/safe-action';
const t = (key: string) => key;

export async function fetchProducts() {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
}

export const addAuction = actionClient
  .schema(AuctionSchema(t))
  .action(async ({ parsedInput: { title, endAt, status, productIds } }) => {
    try {
      console.log('Adding auction with product IDs:', productIds);

      // Create the auction
      await db.auction.create({
        data: {
          title,
          endAt: new Date(endAt),
          status,
          productIds,
        },
      });

      // Update products with auctionEndAt and isInAuction status
      await db.product.updateMany({
        where: { id: { in: productIds } },
        data: {
          auctionEndAt: new Date(endAt),
          isInAuction: status,
        },
      });

      revalidatePath('/admin/auctions');
      return { success: `${title} has been added`, error: '' };
    } catch (error) {
      console.error('Error adding auction:', error);
      throw new Error('Failed to add auction');
    }
  });

export const updateAuction = actionClient
  .schema(AuctionSchema(t))
  .action(async ({ parsedInput: { id, title, endAt, status, productIds } }) => {
    try {
      console.log('Updating auction with product IDs:', productIds);

      // Update the auction
      await db.auction.update({
        where: { id },
        data: {
          title,
          endAt: new Date(endAt),
          status,
          productIds,
        },
      });

      // Update products with auctionEndAt and isInAuction status
      await db.product.updateMany({
        where: { id: { in: productIds } },
        data: {
          auctionEndAt: new Date(endAt),
          isInAuction: status,
        },
      });

      revalidatePath('/admin/auctions');
      return { success: `${title} has been updated`, error: '' };
    } catch (error) {
      console.error('Error updating auction:', error);
      throw new Error('Failed to update auction');
    }
  });

export const deleteAuction = async ({ id }: { id: string }) => {
  try {
    const auction = await db.auction.findUnique({
      where: { id },
      select: { productIds: true },
    });

    if (auction) {
      // Reset isInAuction and auctionEndAt for associated products
      await db.product.updateMany({
        where: { id: { in: auction.productIds } },
        data: {
          isInAuction: false,
          auctionEndAt: null,
        },
      });
    }

    // Delete the auction
    await db.auction.delete({
      where: { id },
    });

    revalidatePath('/admin/auctions');
    return { success: 'Auction has been deleted', error: '' };
  } catch (error) {
    console.error('Error deleting auction:', error);
    throw new Error('Failed to delete auction');
  }
};
