import db from '@/server/db';
import { CategoryForm } from './components/CategoryForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoryPage = async ({ params }: { params: { categoryId: string } }) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <CategoryForm initData={category} />
      </div>
    </ScrollArea>
  );
};

export default CategoryPage;
