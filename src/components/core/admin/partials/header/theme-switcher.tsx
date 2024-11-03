'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      size='icon'
      rounded='full'
      className=' md:bg-secondary bg-transparent  text-secondary-foreground hover:ring-0  md:h-8 md:w-8 h-auto w-auto text-default-900 hover:bg-secondary hover:ring-offset-0'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className='h-[1.5rem] w-[1.3rem] dark:hidden' />
      <Moon className='hidden h-5 w-5 dark:block' />
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
};

export default ThemeButton;
