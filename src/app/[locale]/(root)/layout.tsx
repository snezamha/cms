import LocalSwitcher from '@/components/core/admin/partials/header/locale-switcher';
import { UserMenu } from '@/components/core/admin/partials/header/user-menu';
import ThemeSwitcher from '@/components/core/admin/partials/header/theme-switcher';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='bg-background border-b'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo */}

            {/* Navigation Items - Desktop */}
            <nav className='hidden md:flex space-x-4'></nav>

            <div className='flex items-center'>
              <LocalSwitcher />
              <div className='w-4' />
              <ThemeSwitcher />
              <div className='w-4' />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      <main className='grow m-auto'>{children}</main>
    </div>
  );
}
