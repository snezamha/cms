'use client';

import { ColumnDef, CellContext } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useTranslations } from 'next-intl';

export type AuctionColumn = {
  id: string;
  title: string;
  endAt: string;
  status: boolean;
  productIds: string[];
};

const TitleHeader = () => {
  const scopedT = useTranslations('components.auctions');
  return <>{scopedT('title')}</>;
};

const ProductCountHeader = () => {
  const scopedT = useTranslations('components.auctions');
  return <>{scopedT('countOfProducts')}</>;
};

const EndDateHeader = () => {
  const scopedT = useTranslations('components.auctions');
  return <>{scopedT('endDate')}</>;
};

const StatusHeader = () => {
  const scopedT = useTranslations('components.auctions');
  return <>{scopedT('status')}</>;
};

const StatusContent = ({ cell }: CellContext<AuctionColumn, unknown>) => {
  const value = cell.getValue<boolean>();
  const scopedT = useTranslations('components.auctions');
  return value ? scopedT('open') : scopedT('closed');
};

const ProductCountContent = ({ cell }: CellContext<AuctionColumn, unknown>) => {
  const productIds = cell.getValue<string[]>();
  return productIds ? productIds.length : 0;
};

export const columns: ColumnDef<AuctionColumn>[] = [
  {
    accessorKey: 'title',
    header: TitleHeader,
  },
  {
    accessorKey: 'productIds',
    header: ProductCountHeader,
    cell: ProductCountContent, 
  },
  {
    accessorKey: 'endAt',
    header: EndDateHeader,
  },
  {
    accessorKey: 'status',
    header: StatusHeader,
    cell: StatusContent,
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
