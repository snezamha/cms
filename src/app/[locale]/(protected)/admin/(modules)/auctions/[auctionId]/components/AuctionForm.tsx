'use client';
import * as z from 'zod';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { Auction } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ReactSelect from 'react-select';
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
  addAuction,
  updateAuction,
  deleteAuction,
  fetchProducts,
} from '../../actions/auction-actions';
import { useEffect, useState } from 'react';
import { AuctionSchema } from '../../types/auction.schema';
import { useTranslations } from 'next-intl';
import DeleteConfirmationDialog from '@/components/core/admin/delete-confirmation-dialog';

interface AuctionFormProps {
  initData?: Auction | null;
}

export const AuctionForm: React.FC<AuctionFormProps> = ({ initData }) => {
  const params = useParams();
  const router = useRouter();
  const scopedT = useTranslations('components.auctions');

  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);

  const title = initData ? scopedT('auction') : scopedT('auction');
  const description = initData ? scopedT('editAuction') : scopedT('addAuction');
  const toastMessage = initData
    ? scopedT('auctionUpdated')
    : scopedT('auctionCreated');
  const action = initData ? scopedT('saveChanges') : scopedT('create');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productData = await fetchProducts();
        setProducts(productData);
      } catch (error) {
        console.log(error);
        toast.error(scopedT('failedToFetchProducts'));
      }
    };
    loadProducts();
  }, [scopedT]);

  const createAuctionSchema = AuctionSchema(scopedT);
  const form = useForm<z.infer<typeof createAuctionSchema>>({
    resolver: zodResolver(createAuctionSchema),
    defaultValues: initData
      ? {
          id: initData.id,
          title: initData.title,
          endAt:
            initData.endAt instanceof Date
              ? initData.endAt.toISOString().slice(0, 16)
              : initData.endAt,
          status: initData.status,
          productIds: initData.productIds || [],
        }
      : {
          title: '',
          endAt: new Date().toISOString().slice(0, 16),
          status: false,
          productIds: [],
        },
  });

  const { execute } = useAction(initData ? updateAuction : addAuction, {
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(toastMessage);
        form.reset();
        router.push('/admin/auctions');
        router.refresh();
      } else if (data.data?.error) {
        toast.error(data.data.error);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof createAuctionSchema>) => {
    execute(values);
  };

  const onDelete = () => {
    if (!initData || !initData.id) {
      toast.error(scopedT('somethingWentWrong'));
      return;
    }

    deleteAuction({ id: initData.id })
      .then((result) => {
        toast.success(scopedT('auctionDeleted'));
        router.push('/admin/auctions');
        router.refresh();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.name,
  }));

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
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('title')}</FormLabel>
                  <FormControl>
                    <Input placeholder={scopedT('auctionTitle')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='productIds'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{scopedT('selectProducts')}</FormLabel>
                  <FormControl>
                    <ReactSelect
                      isMulti
                      options={productOptions}
                      onChange={(selectedOptions) =>
                        field.onChange(
                          selectedOptions.map((option) => option.value)
                        )
                      }
                      value={productOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      placeholder={scopedT('searchProduct')}
                      isSearchable
                      noOptionsMessage={() => scopedT('noOptionFound')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-xl'>
              <FormField
                control={form.control}
                name='endAt'
                render={({ field }) => (
                  <FormItem className='flex-1 w-full sm:max-w-xs'>
                    <FormLabel>{scopedT('endDate')}</FormLabel>
                    <FormControl>
                      <Input
                        type='datetime-local'
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='flex-1 w-full sm:max-w-xs'>
                    <FormLabel>{scopedT('status')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(selectedValue) =>
                          field.onChange(selectedValue === 'true')
                        }
                        value={field.value ? 'true' : 'false'}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='true'>
                            {scopedT('open')}
                          </SelectItem>
                          <SelectItem value='false'>
                            {scopedT('closed')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className='flex justify-between gap-2'>
            <Button>{action}</Button>
            <Button
              type='button'
              onClick={() => router.push('/admin/auctions')}
            >
              {scopedT('cancel')}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
