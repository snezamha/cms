'use client';

import { ColumnDef, CellContext } from '@tanstack/react-table';
import { CellAction } from './cell-action';
import { useTranslations } from 'next-intl';

export type CategoryColumn = {
  id: string;
  name: string;
  parentName?: string;
  type: string;
};

const NameHeader = () => {
  const scopedT = useTranslations('components.categories');
  return <>{scopedT('name')}</>;
};

const TypeHeader = () => {
  const scopedT = useTranslations('components.categories');
  return <>{scopedT('type')}</>;
};

const ParentCategoryHeader = () => {
  const scopedT = useTranslations('components.categories');
  return <>{scopedT('parentCategory')}</>;
};

const CellContent = ({ cell }: CellContext<CategoryColumn, unknown>) => {
  const value = cell.getValue<string>();
  const scopedT = useTranslations('components.categories');
  switch (value) {
    case 'product':
      return scopedT('product');
    case 'blog':
      return scopedT('blog');
    case 'news':
      return scopedT('news');
  }
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: NameHeader,
  },
  {
    accessorKey: 'type',
    header: TypeHeader,
    cell: CellContent,
  },
  {
    accessorKey: 'parentName',
    header: ParentCategoryHeader,
  },
  {
    id: 'action',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
