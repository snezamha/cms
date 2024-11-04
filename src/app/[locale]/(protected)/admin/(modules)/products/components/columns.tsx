'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useTranslations } from 'next-intl';

export type ProductColumn = {
  id: string;
  price: string;
  name: string;
  category: string;
};

const NameHeader = () => {
  const scopedT = useTranslations('components.store');
  return <>{scopedT('name')}</>;
};

const NameCategory = () => {
  const scopedT = useTranslations('components.store');
  return <>{scopedT('category')}</>;
};

const NamePrice = () => {
  const scopedT = useTranslations('components.store');
  return <>{scopedT('price')}</>;
};
export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: NameHeader,
    cell: ({ row }) => (
      <div className='truncate max-w-[300px]'>{row.original.name}</div>
    ),
  },
  {
    accessorKey: 'category',
    header: NameCategory,
    cell: ({ row }) => <div>{row.original.category}</div>,
  },
  {
    accessorKey: 'price',
    header: NamePrice,
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
