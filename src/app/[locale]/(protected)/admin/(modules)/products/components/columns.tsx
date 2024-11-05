import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

export type ProductColumn = {
  id: string;
  price: string;
  name: string;
  category: string;
  status: boolean;
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

const Namestatus = () => {
  const scopedT = useTranslations('components.store');
  return <>{scopedT('status')}</>;
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
    accessorKey: 'status',
    header: Namestatus,
    cell: ({ row }) => {
      const isActive = row.original.status;
      return (
        <div className='flex items-center'>
          {isActive ? (
            <Check className='text-green-600' />
          ) : (
            <X className='text-yellow-600' />
          )}
        </div>
      );
    },
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
