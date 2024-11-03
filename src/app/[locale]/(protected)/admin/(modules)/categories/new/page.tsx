import { CategoryForm } from '../[categoryId]/components/CategoryForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoryPage = async () => {
  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <CategoryForm />
      </div>
    </ScrollArea>
  );
};

export default CategoryPage;
