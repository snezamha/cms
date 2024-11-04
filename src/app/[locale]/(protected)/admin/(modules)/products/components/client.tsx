'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ProductColumn, columns } from './columns';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/core/admin/dashboard/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/core/admin/dashboard/data-table';
import { useTranslations } from 'next-intl';

interface ProductClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const scopedT = useTranslations('components.store');

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`${scopedT('products')} (${data.length})`}
          description=''
          className='flex items-center'
        />
        <Button onClick={() => router.push(`products/new`)}>
          <Plus className='w-4 h-4 ltr:mr-2 rtl:ml-2' />
          {scopedT('addNew')}
        </Button>
      </div>

      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  );
};
