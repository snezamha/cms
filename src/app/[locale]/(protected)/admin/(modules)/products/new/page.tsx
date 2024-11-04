import { ProductForm } from '../[productId]/components/ProductForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const ProductPage = async () => {
  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <ProductForm />
      </div>
    </ScrollArea>
  );
};

export default ProductPage;
