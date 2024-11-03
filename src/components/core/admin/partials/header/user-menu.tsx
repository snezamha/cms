'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@/components/ui/icon';
import { Link } from '@/i18n/routing';
import { User2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export function UserMenu() {
  const { data: session } = useSession();
  const t = useTranslations('Auth');

  return (
    <div className=''>
      <DropdownMenu>
        {session ? (
          <DropdownMenuTrigger asChild className=' cursor-pointer'>
            <Button
              size='icon'
              rounded='full'
              className='md:bg-secondary bg-transparent text-secondary-foreground hover:ring-0 md:h-8 md:w-8 h-auto w-auto text-default-900 hover:bg-secondary hover:ring-offset-0'
            >
              <User2 className='h-5 w-5' />
              <span className='sr-only'>User Nav</span>
            </Button>
          </DropdownMenuTrigger>
        ) : (
          <Link href='/auth'>
            <Button
              size='icon'
              rounded='full'
              className='md:bg-secondary bg-transparent text-secondary-foreground hover:ring-0 md:h-8 md:w-8 h-auto w-auto text-default-900 hover:bg-secondary hover:ring-offset-0'
            >
              <User2 className='h-5 w-5' />
              <span className='sr-only'>User Nav</span>
            </Button>
          </Link>
        )}

        {session && (
          <DropdownMenuContent className='w-56 p-0' align='end' forceMount>
            <DropdownMenuLabel className='pt-3'>
              <div className='flex flex-col space-y-1 text-center cursor-pointer'>
                <p className='text-xs text-default-600 hover:text-primary'>
                  {session.user?.phoneNumber}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href='/admin' className='cursor-pointer'>
                <DropdownMenuItem className='flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer'>
                  <Icon icon='heroicons:tv' className='w-4 h-4' />
                  {t('adminDashboard')}
                </DropdownMenuItem>
              </Link>
              <Link href='/' className='cursor-pointer'>
                <DropdownMenuItem className='flex items-center gap-2 text-sm font-medium text-default-600 capitalize px-3 py-1.5 cursor-pointer'>
                  <Icon icon='heroicons:home' className='w-4 h-4' />
                  {t('mainPage')}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className='mb-0 dark:bg-background' />
            <DropdownMenuItem className='flex items-center gap-2 text-sm font-medium text-default-600 capitalize my-1 px-3 cursor-pointer'>
              <div>
                <button
                  type='submit'
                  className=' w-full flex items-center gap-2'
                  onClick={() => signOut()}
                >
                  <Icon icon='heroicons:power' className='w-4 h-4' />
                  {t('logout')}
                </button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
