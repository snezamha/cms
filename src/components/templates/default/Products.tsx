import Link from 'next/link';
import { Suspense } from 'react';

import LatestProducts from './LatestProducts';
import LatestProductsSkeleton from './skeletons/LatestProductsSkeleton';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

const Products = async () => {
  const t = await getTranslations('Front.LatestProducts');
  return (
    <section
      id='products'
      aria-labelledby='product-heading'
      className='space-y-8 px-4 sm:px-6 lg:px-8 py-8 md:pt-10 lg:pt-24'
    >
      <div className='flex items-end justify-between'>
        <div className='flex flex-col space-y-4'>
          <h2 className='text-3xl md:text-5xl text-start text-emerald-600 font-bold leading-[1.1]'>
            {t('latestProducts')}
          </h2>
          <h3 className='leading-normal text-muted-foreground sm:text-lg sm:leading-7'>
            {t('textTwo')}
          </h3>
        </div>
        <a
          href='/products'
          className='hidden md:flex gap-1 text-emerald-700 hover:translate-x-1 hover:text-emerald-600 transition-all'
        >
          {t('shopTheCollection')}
        </a>
      </div>
      <Suspense fallback={<LatestProductsSkeleton />}>
        <LatestProducts />
      </Suspense>
      <Link
        href='/products'
        className={cn(
          buttonVariants(),
          'mx-auto bg-emerald-700 flex w-fit hover:before:-translate-x-48'
        )}
      >
        {t('viewAllProducts')}
      </Link>
    </section>
  );
};

export default Products;
