'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { AuctionColumn, columns } from './columns';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/core/admin/dashboard/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/core/admin/dashboard/data-table';
import { useTranslations } from 'next-intl';

interface AuctionClientProps {
  data: AuctionColumn[];
}

export const AuctionClient: React.FC<AuctionClientProps> = ({ data }) => {
  const router = useRouter();
  const scopedT = useTranslations('components.auctions');

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`${scopedT('auction')} (${data.length})`}
          description=''
          className='flex items-center'
        />
        <Button onClick={() => router.push(`auctions/new`)}>
          <Plus className='w-4 h-4 ltr:mr-2 rtl:ml-2' />
          {scopedT('addNew')}
        </Button>
      </div>

      <Separator />
      <DataTable searchKey='title' columns={columns} data={data} />
    </>
  );
};
