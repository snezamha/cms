import React from 'react';
import HeaderContent from './header-content';
import { UserMenu } from './user-menu';
import ThemeSwitcher from './theme-switcher';
import { SidebarToggle } from '../sidebar/sidebar-toggle';
import { SheetMenu } from '../sidebar/menu/sheet-menu';
import HorizontalMenu from './horizontal-menu';
import LocalSwitcher from './locale-switcher';
import HeaderLogo from './header-logo';

const DashbordHeader = async () => {
  return (
    <>
      <HeaderContent>
        <div className=' flex gap-3 items-center'>
          <HeaderLogo />
          <SidebarToggle />
        </div>
        <div className='nav-tools flex items-center  md:gap-4 gap-3'>
          <LocalSwitcher />
          <ThemeSwitcher />
          <UserMenu />
          <SheetMenu />
        </div>
      </HeaderContent>
      <HorizontalMenu />
    </>
  );
};

export default DashbordHeader;
