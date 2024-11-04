'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Category, Product } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  addProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
} from '../../actions/product-actions';
import { useEffect, useState } from 'react';
import { productPayload, productSchema } from '../../types/product.schema';
import { useTranslations } from 'next-intl';
import DeleteConfirmationDialog from '@/components/core/admin/delete-confirmation-dialog';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './FileUpload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatPrice } from '@/lib/utils';

interface ProductFormProps {
  initData?: Product | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initData }) => {
  const router = useRouter();
  const scopedT = useTranslations('components.store');
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const title = initData ? scopedT('product') : scopedT('product');
  const description = initData ? scopedT('editProduct') : scopedT('addProduct');
  const toastMessage = initData
    ? scopedT('productUpdated')
    : scopedT('productCreated');
  const action = initData ? scopedT('saveChanges') : scopedT('create');

  type ImageType = {
    fileKey: string;
    fileName: string;
    fileSize: number;
    fileUrl: string;
    key: string;
    name: string;
    size: number;
    url: string;
  };

  const isImageType = (item: any): item is ImageType => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'url' in item &&
      typeof item.url === 'string'
    );
  };

  const form = useForm<productPayload>({
    resolver: zodResolver(productSchema),
    defaultValues: initData
      ? {
          id: initData.id,
          name: initData.name,
          description: initData.description ?? '',
          price: parseFloat(String(initData.price)),
          category: initData.categoryId ?? undefined,
          images: Array.isArray(initData.images)
            ? initData.images.filter(isImageType).map((image) => ({
                fileKey: image.fileKey || '',
                fileName:
                  image.fileName ||
                  (image.url ? image.url.split('/').pop() : ''),
                fileSize: image.fileSize ?? 0,
                fileUrl: image.fileUrl || image.url || '',
                key: image.key || '',
                name: image.name || '',
                size: image.size ?? 0,
                url: image.url || '',
              }))
            : undefined,
        }
      : {
          name: '',
          description: '',
          price: 1000000,
        },
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch categories');
      }
    };
    loadCategories();
  }, []);

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { execute } = useAction(initData ? updateProduct : addProduct, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(toastMessage);
        form.reset();
        router.push('/admin/products');
        router.refresh();
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    execute(values);
  };

  const onDelete = () => {
    if (!initData || !initData.id) {
      toast.error(scopedT('somethingWentWrong'));
      return;
    }

    deleteProduct({ id: initData.id })
      .then((result) => {
        if (result.error) {
          toast.error(scopedT('hasChild'));
        } else {
          toast.success(scopedT('productDeleted'));
          router.push('/admin/products');
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
                    <Input placeholder={scopedT('pNPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={scopedT('pDPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col items-start gap-6 sm:flex-row'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem className='flex-1 w-full'>
                  <FormLabel>{scopedT('category')}</FormLabel>
                  <Select
                    value={field.value ?? undefined}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={scopedT('sACategory')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent onMouseDown={(e) => e.stopPropagation()}>
                      <div className='px-3 py-1'>
                        <Input
                          placeholder={scopedT('searchCategories')}
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      </div>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem className='flex-1 w-full'>
                  <FormLabel>{scopedT('price')}</FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      value={
                        field.value !== undefined
                          ? formatPrice(field.value)
                          : ''
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, '');
                        const parsedValue = parseFloat(rawValue);
                        field.onChange(
                          rawValue === '' || isNaN(parsedValue)
                            ? undefined
                            : parsedValue
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='images'
            render={({ field }) => (
              <FormItem>
                <FormLabel>{scopedT('images')}</FormLabel>
                <FormControl>
                  <FileUpload
                    endpoint='imageUploader'
                    value={field.value}
                    onChange={(file) =>
                      field.value
                        ? field.onChange([...(field.value || []), ...file])
                        : field.onChange([...file])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...(field.value || []).filter(
                          (current) => current.url !== url
                        ),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex justify-between gap-2'>
            <Button>{action}</Button>
            <Button
              type='button'
              onClick={() => router.push('/admin/products')}
            >
              {scopedT('cancel')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
