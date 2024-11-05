import db from '@/server/db';

import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import PageContainer from '@/components/core/admin/dashboard/page-container';
import { formatPrice } from '@/lib/utils';

const ProductsPage = async () => {
  const products = await db.product.findMany({
    include: {
      category: {
        // Join with the Category table to get the category name
        select: {
          name: true, // Only select the 'name' field from the Category table
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    price: formatPrice(item.price),
    name: item.name,
    category: item.category?.name || '',
    status: item.status,
  }));

  return (
    <PageContainer>
      <div className='space-y-4'>
        <ProductClient data={formattedProducts} />
      </div>
    </PageContainer>
  );
};

export default ProductsPage;
