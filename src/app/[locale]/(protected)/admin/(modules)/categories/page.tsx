import db from '@/server/db';

import { CategoryClient } from './components/client';
import { CategoryColumn } from './components/columns';
import PageContainer from '@/components/core/admin/dashboard/page-container';

const CategoriesPage = async () => {
  const categories = await db.category.findMany({
    include: {
      parent: true,
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    type: item.type,
    parentName: item.parent?.name,
  }));

  return (
    <PageContainer>
      <div className='space-y-4'>
        <CategoryClient data={formattedCategories} />
      </div>
    </PageContainer>
  );
};

export default CategoriesPage;
