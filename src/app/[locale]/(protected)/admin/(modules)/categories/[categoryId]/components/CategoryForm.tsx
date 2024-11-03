'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Category } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Heading } from '@/components/core/admin/dashboard/heading';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAction } from 'next-safe-action/hooks';
import {
  addCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from '../../actions/category-actions';
import { useEffect, useState } from 'react';
import { CategorySchema } from '../../types/category.schema';
import { useTranslations } from 'next-intl';
import DeleteConfirmationDialog from '@/components/core/admin/delete-confirmation-dialog';

interface CategoryFormProps {
  initData?: Category | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initData }) => {
  const params = useParams();

  const router = useRouter();

  const scopedT = useTranslations('components.categories');

  const [open, setOpen] = useState(false);

  const [loading] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);

  const [searchTerm, setSearchTerm] = useState('');

  const title = initData ? scopedT('category') : scopedT('category');

  const description = initData
    ? scopedT('editCategory')
    : scopedT('addCategory');

  const toastMessage = initData
    ? scopedT('categoryUpdated')
    : scopedT('categoryCreated');

  const action = initData ? scopedT('saveChanges') : scopedT('create');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.log(error);
        toast.error(scopedT('failedToFetchCategories'));
      }
    };
    loadCategories();
  }, [scopedT]);

  const filteredCategories = categories.filter(
    (category) =>
      category.id !== params.categoryId &&
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initData
      ? {
          id: initData.id,
          name: initData.name,
          type: initData.type as 'blog' | 'product',
          parentId: initData.parentId ?? null,
        }
      : {
          name: '',
          type: 'blog',
        },
  });

  const { execute } = useAction(initData ? updateCategory : addCategory, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(toastMessage);
        form.reset();
        router.push('/admin/categories');
        router.refresh();
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof CategorySchema>) => {
    execute(values);
  };

  const onDelete = () => {
    if (!initData || !initData.id) {
      toast.error(scopedT('somethingWentWrong'));
      return;
    }

    deleteCategory({ id: initData.id })
      .then((result) => {
        if (result.error) {
          toast.error(scopedT('hasChild'));
        } else {
          toast.success(scopedT('categoryDeleted'));
          router.push('/admin/categories');
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {initData && (
          <Button
            color='destructive'
            variant='default'
            size='sm'
            onClick={() => setOpen(true)}
          >
            <Trash className='w-4 h-4' />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-8 w-full'
        >
          <div className='grid w-full max-w-xl gap-5'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={scopedT('categoryName')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('type')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder=''
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem key='blog' value='blog'>
                        {scopedT('blog')}
                      </SelectItem>
                      <SelectItem key='product' value='product'>
                        {scopedT('product')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='parentId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('parentCategory')}</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value === 'null' ? null : value)
                      }
                      value={field.value || 'null'}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={scopedT('selectParentCategory')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <div className='px-3 py-1'>
                          <Input
                            placeholder={scopedT('searchCategories')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        {filteredCategories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex justify-between gap-2'>
            <Button>{action}</Button>
            <Button
              type='button'
              onClick={() => router.push('/admin/categories')}
            >
              {scopedT('cancel')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
