'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { useTransition } from 'react';
import { CheckIcon, LanguagesIcon, Loader } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function LocalSwitcher() {
  const t = useTranslations('Locale');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const localActive = useLocale();
  const locales = [
    {
      name: t('english'),
      value: 'en',
    },
    {
      name: t('persian'),
      value: 'fa',
    },
  ];
  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          rounded='full'
          className=' md:bg-secondary bg-transparent  text-secondary-foreground hover:ring-0  md:h-8 md:w-8 h-auto w-auto text-default-900 hover:bg-secondary hover:ring-offset-0'
        >
          {isPending ? (
            <Loader className='h-5 w-5 animate-spin' />
          ) : (
            <LanguagesIcon className='h-5 w-5' />
          )}
          <span className='sr-only'>Change Locale</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='center'>
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale.value}
            onClick={() => onSelectChange(locale.value)}
            disabled={locale.value === localActive}
          >
            <span>{locale.name}</span>
            {locale.value === localActive ? (
              <CheckIcon className='h-5 w-5 check-icon ltr:ml-auto rtl:mr-auto' />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
