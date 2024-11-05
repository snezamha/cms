'use server';
import { revalidatePath } from 'next/cache';
import db from '@/server/db';
import { productSchema } from '../types/product.schema';
import { actionClient } from '@/lib/admin/safe-action';
import deleteFiles from '../[productId]/components/delete-files';
const t = (key: string) => key;

export async function fetchCategories() {
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

// Add new product
export const addProduct = actionClient
  .schema(productSchema(t))
  .action(async ({ parsedInput }) => {
    const {
      name,
      description,
      price,
      category,
      images,
      countInStock,
      discountPercent,
      isInAuction,
      status,
    } = parsedInput;

    try {
      await db.product.create({
        data: {
          name,
          description,
          price: price.toString(),
          category: category ? { connect: { id: category } } : undefined,
          images: images || [],
          countInStock:
            countInStock !== undefined ? countInStock.toString() : '',
          discountPercent:
            discountPercent !== undefined ? discountPercent.toString() : '',
          isInAuction: isInAuction ?? false,
          status: status ?? true,
        },
      });
      revalidatePath('/admin/products');
      return { success: `${name} has been added`, error: '' };
    } catch (error) {
      console.error('Error adding product:', error);
      return { success: '', error: 'Failed to add product' };
    }
  });

// Update existing product
export const updateProduct = actionClient
  .schema(productSchema(t))
  .action(async ({ parsedInput }) => {
    const {
      id,
      name,
      description,
      price,
      category,
      images,
      countInStock,
      discountPercent,
      isInAuction,
      status,
    } = parsedInput;

    try {
      await db.product.update({
        where: { id },
        data: {
          name,
          description,
          price: price.toString(),
          category: category ? { connect: { id: category } } : undefined,
          images: images || [],
          countInStock:
            countInStock !== undefined ? countInStock.toString() : '',
          discountPercent:
            discountPercent !== undefined ? discountPercent.toString() : '',
          isInAuction: isInAuction ?? false,
          status: status ?? true,
        },
      });
      revalidatePath('/admin/products');
      return { success: `${name} has been updated`, error: '' };
    } catch (error) {
      console.error('Error updating product:', error);
      return { success: '', error: 'Failed to update product' };
    }
  });

// Delete product
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
