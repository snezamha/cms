'use server';
import { revalidatePath } from 'next/cache';
import db from '@/server/db';
import { CategorySchema } from '../types/category.schema';
import { actionClient } from '@/lib/admin/safe-action';
import { Category } from '@prisma/client';

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany();
    return categories;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch categories');
  }
}

export const addCategory = actionClient
  .schema(CategorySchema)
  .action(async ({ parsedInput: { name, type, parentId } }) => {
    await db.category.create({
      data: {
        name,
        type,
        parentId: parentId ?? null,
      },
    });
    revalidatePath('/admin/categories');
    return { success: `${name} has been added`, error: '' };
  });

export const updateCategory = actionClient
  .schema(CategorySchema)
  .action(async ({ parsedInput: { id, name, type, parentId } }) => {
    await db.category.update({
      where: { id: id },
      data: {
        name,
        type,
        parentId: parentId ?? null,
      },
    });
    revalidatePath('/admin/categories');
    return { success: `${name} has been updated`, error: '' };
  });

export const deleteCategory = async ({ id }: { id: string }) => {
  const childCategories = await db.category.findMany({
    where: {
      parentId: id,
    },
  });

  if (childCategories.length > 0) {
    return {
      success: '',
      error:
        'Cannot delete category with child categories. Please remove or reassign the child categories first.',
    };
  }

  await db.category.delete({
    where: { id },
  });

  revalidatePath('/admin/categories');
  return { success: 'Category has been deleted', error: '' };
};
