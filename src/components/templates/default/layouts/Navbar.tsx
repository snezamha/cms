'use client';

import type { User } from 'next-auth';
import Link from 'next/link';

import CartButton from '../cart/CartButton';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import { buttonVariants } from '@/components/ui/button';
import { UserMenu } from '@/components/core/admin/partials/header/user-menu';
import LocalSwitcher from '@/components/core/admin/partials/header/locale-switcher';
import ThemeSwitcher from '@/components/core/admin/partials/header/theme-switcher';

interface NavbarProps {
  user?: User & {
    id: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background py-3'>
      <nav className='container px-2 sm:px-4 lg:px-6 flex items-center justify-between'>
        {/* Left */}
        <MobileNav />
        <DesktopNav />

        {/* Right */}
        <div className='flex items-center gap-x-2'>
          <CartButton />
          <div className='w-4' />
          {user ? (
            <UserMenu />
          ) : (
            <Link
              href='/sign-in'
              className={buttonVariants({
                size: 'sm',
              })}
            >
              Sign In
              <span className='sr-only'>Sign In</span>
            </Link>
          )}
          <div className='w-4' />
          <ThemeSwitcher />
          <div className='w-4' />
          <LocalSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
