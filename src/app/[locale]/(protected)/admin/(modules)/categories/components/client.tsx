'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CategoryColumn, columns } from './columns';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/core/admin/dashboard/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/core/admin/dashboard/data-table';
import { useTranslations } from 'next-intl';

interface CategoryClientProps {
  data: CategoryColumn[];
}

export const CategoryClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();
  const scopedT = useTranslations('components.categories');

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`${scopedT('category')} (${data.length})`}
          description=''
          className='flex items-center'
        />
        <Button onClick={() => router.push(`categories/new`)}>
          <Plus className='w-4 h-4 ltr:mr-2 rtl:ml-2' />
          {scopedT('addNew')}
        </Button>
      </div>

      <Separator />
      <DataTable searchKey='name' columns={columns} data={data} />
    </>
  );
};
