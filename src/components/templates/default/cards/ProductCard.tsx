'use client';

import { Category, Product } from '@prisma/client';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { MouseEventHandler } from 'react';

import IconButton from '../IconButton';
import { formatPrice } from '@/lib/utils';
import useCart from '@/hooks/front/useCart';
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  product: Product & {
    Category: Category | null;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cart = useCart();

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    cart.addItem(product);
  };

  const productImageUrl =
    Array.isArray(product.images) && product.images.length > 0
      ? (product.images[0] as { url: string }).url
      : '/images/default_product.svg';

  const scopedT = useTranslations('Front.Products');

  return (
    <div className='group/card shadow-lg border hover:shadow-2xl duration-300 transition-all rounded-2xl space-y-4 h-full'>
      <Link href={`/products/?productId=${product.id}`}>
        <div
          className={`aspect-square m-3 rounded-2xl relative ${
            productImageUrl === '/images/default_product.svg'
              ? 'bg-gray-800 flex items-center justify-center text-gray-400'
              : 'bg-gray-100'
          }`}
        >
          {productImageUrl === '/images/default_product.svg' ? (
            <span>{scopedT('noImageAvailable')}</span>
          ) : (
            <Image
              src={productImageUrl}
              fill
              sizes='200'
              alt={product.name}
              className='aspect-square object-cover rounded-2xl'
            />
          )}
        </div>
        <div className='px-4 space-y-3 pb-6'>
          <div className='space-y-1'>
            <p className='text-sm text-gray-500'>
              {product.Category?.name || '\u00A0'}
            </p>
            <p
              className='font-semibold group-hover/card:text-emerald-800 text-lg truncate'
              title={product.name}
            >
              {product.name}
            </p>
            <p className='text-sm text-gray-500'>
              {product.description
                ? `${product.description.slice(0, 30)} ...`
                : '\u00A0'}
            </p>
          </div>
          <div className='flex items-center justify-between'>
            <div className='font-semibold text-emerald-700'>
              {formatPrice(product.price)} {scopedT('rial')}
            </div>
            <div className='flex justify-center group/icon'>
              <IconButton
                aria-label='add-to-cart'
                className='bg-emerald-50 group-hover/icon:bg-emerald-500'
                onClick={onAddToCart}
                icon={
                  <ShoppingCart
                    size={20}
                    className='text-emerald-600 group-hover/icon:text-emerald-50'
                  />
                }
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
