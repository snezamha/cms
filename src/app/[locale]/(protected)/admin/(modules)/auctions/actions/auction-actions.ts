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

// Add Auction
export const addAuction = actionClient
  .schema(AuctionSchema(t))
  .action(async ({ parsedInput: { title, endAt, status, productIds } }) => {
    try {
      const auction = await db.auction.create({
        data: {
          title,
          endAt: new Date(endAt),
          status,
          productIds,
        },
      });

      // Update products to include the new auction ID and set `isInAuction` to true
      await db.product.updateMany({
        where: { id: { in: productIds } },
        data: {
          auctionIds: {
            push: auction.id,
          },
          auctionEndAt: new Date(endAt),
          isInAuction: true,
        },
      });

      revalidatePath('/admin/auctions');
      return { success: `${title} has been added`, error: '' };
    } catch (error) {
      console.error('Error adding auction:', error);
      throw new Error('Failed to add auction');
    }
  });

// Update Auction
export const updateAuction = actionClient
  .schema(AuctionSchema(t))
  .action(async ({ parsedInput: { id, title, endAt, status, productIds } }) => {
    try {
      const currentAuction = await db.auction.findUnique({
        where: { id },
        select: { productIds: true },
      });

      if (!currentAuction) throw new Error('Auction not found');

      const addedProductIds = productIds.filter(
        (pid) => !currentAuction.productIds.includes(pid)
      );
      const removedProductIds = currentAuction.productIds.filter(
        (pid) => !productIds.includes(pid)
      );

      // Update auction details
      await db.auction.update({
        where: { id },
        data: {
          title,
          endAt: new Date(endAt),
          status,
          productIds,
        },
      });

      // Add auction ID to new products
      await db.product.updateMany({
        where: { id: { in: addedProductIds } },
        data: {
          auctionIds: {
            push: id,
          },
          auctionEndAt: new Date(endAt),
          isInAuction: true,
        },
      });

      // Update removed products by removing auction ID and adjusting `isInAuction`
      const removedProducts = await db.product.findMany({
        where: { id: { in: removedProductIds } },
        select: { id: true, auctionIds: true, auctionEndAt: true },
      });

      for (const product of removedProducts) {
        const updatedAuctionIds = product.auctionIds.filter(
          (auctionId) => auctionId !== id
        );

        await db.product.update({
          where: { id: product.id },
          data: {
            auctionIds: updatedAuctionIds,
            isInAuction: updatedAuctionIds.length > 0,
            auctionEndAt:
              updatedAuctionIds.length > 0 ? product.auctionEndAt : null,
          },
        });
      }

      revalidatePath('/admin/auctions');
      return { success: `${title} has been updated`, error: '' };
    } catch (error) {
      console.error('Error updating auction:', error);
      throw new Error('Failed to update auction');
    }
  });

// Delete Auction
export const deleteAuction = async ({ id }: { id: string }) => {
  try {
    const auction = await db.auction.findUnique({
      where: { id },
      select: { productIds: true },
    });

    if (auction) {
      const products = await db.product.findMany({
        where: { id: { in: auction.productIds } },
        select: { id: true, auctionIds: true, auctionEndAt: true },
      });

      for (const product of products) {
        const updatedAuctionIds = product.auctionIds.filter(
          (auctionId) => auctionId !== id
        );

        await db.product.update({
          where: { id: product.id },
          data: {
            auctionIds: updatedAuctionIds,
            isInAuction: updatedAuctionIds.length > 0,
            auctionEndAt:
              updatedAuctionIds.length > 0 ? product.auctionEndAt : null,
          },
        });
      }
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
