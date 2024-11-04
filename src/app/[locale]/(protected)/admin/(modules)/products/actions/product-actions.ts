'use server';
import { revalidatePath } from 'next/cache';
import db from '@/server/db';
import { productSchema } from '../types/product.schema';
import { actionClient } from '@/lib/admin/safe-action';
import { Category } from '@prisma/client';
import deleteFiles from '../[productId]/components/delete-files';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      where: {
        type: 'product',
      },
      include: {
        children: true,
      },
    });
    return categories;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch categories');
  }
}

export const addProduct = actionClient
  .schema(productSchema)
  .action(async ({ parsedInput }) => {
    const { name, description, price, category, images } = parsedInput;

    try {
      await db.product.create({
        data: {
          name,
          description,
          price: price.toString(),
          category: category ? { connect: { id: category } } : undefined,
          images: images || [],
        },
      });
      revalidatePath('/admin/products');
      return { success: `${name} has been added`, error: '' };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: '', error: 'Failed to add product' };
    }
  });

export const updateProduct = actionClient
  .schema(productSchema)
  .action(
    async ({
      parsedInput: { id, name, description, price, category, images },
    }) => {
      await db.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price.toString(),
          category: category ? { connect: { id: category } } : undefined,
          images: images || [],
        },
      });
      revalidatePath('/admin/categories');
      return { success: `${name} has been updated`, error: '' };
    }
  );

export const deleteProduct = async ({ id }: { id: string }) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      select: { images: true },
    });

    const images = product?.images as unknown as Array<{ key: string }>;

    const imageKeys = images ? images.map((image) => image.key) : [];

    for (const key of imageKeys) {
      await deleteFiles(key); // Delete each file one by one
    }

    await db.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    return { success: 'Product has been deleted', error: '' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: '', error: 'Failed to delete product' };
  }
};
