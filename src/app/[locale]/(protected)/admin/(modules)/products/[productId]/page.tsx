import db from '@/server/db';
import { ProductForm } from './components/ProductForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoryPage = async ({ params }: { params: { productId: string } }) => {
  const product = await db.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <ProductForm initData={product!} />
      </div>
    </ScrollArea>
  );
};

export default CategoryPage;
