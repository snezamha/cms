import ProductCard from './cards/ProductCard';
import prisma from '@/server/db';

const PopularProducts = async () => {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true,
    },
    take: 8,
  });

  const productsWithCategoryAlias = products.map((product) => ({
    ...product,
    Category: product.category,
  }));

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {productsWithCategoryAlias.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default PopularProducts;
