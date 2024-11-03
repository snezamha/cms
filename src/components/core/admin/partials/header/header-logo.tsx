'use client';
import React from 'react';
import { Link } from '@/components/core/navigation';
import { useConfig } from '@/hooks/use-config';
import { useMediaQuery } from '@/hooks/use-media-query';

const HeaderLogo = () => {
  const [config] = useConfig();

  const isDesktop = useMediaQuery('(min-width: 1280px)');

  return config.layout === 'horizontal' ? (
    <Link href='/admin' className='flex gap-2 items-center    '>
      {/* Logo */}
      <h1 className='text-xl font-semibold text-default-900 lg:block hidden '>
        {/* Logo */}
      </h1>
    </Link>
  ) : (
    !isDesktop && (
      <Link href='/admin' className='flex gap-2 items-center    '>
        {/* Logo */}
        <h1 className='text-xl font-semibold text-default-900 lg:block hidden '>
          {/* Logo */}
        </h1>
      </Link>
    )
  );
};

export default HeaderLogo;
