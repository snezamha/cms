export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: string;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(
  pathname: string,
  t: (key: string) => string
): Group[] {
  return [
    {
      groupLabel: t('basicItems'),
      id: 'basicItems',
      menus: [
        {
          id: 'admin',
          href: '/admin',
          label: t('admin'),
          active: pathname.includes('/admin'),
          icon: 'heroicons:tv',
          submenus: [
            {
              href: '/admin',
              label: t('adminDashboard'),
              active: pathname === '/admin',
              icon: '',
              children: [],
            },
            {
              href: '/admin/categories',
              label: t('categories'),
              active:
                pathname === '/admin/categories' ||
                pathname === '/admin/categories/new' ||
                /^\/admin\/categories\/[a-fA-F0-9]{24}$/.test(pathname),
              icon: '',
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: t('apps'),
      id: 'store',
      menus: [
        {
          id: 'store',
          href: '/admin',
          label: t('store'),
          active: pathname.includes('/admin'),
          icon: 'heroicons-outline:shopping-bag',
          submenus: [
            {
              href: '/admin/products',
              label: t('products'),
              active: pathname.includes('/admin/products'),
              icon: '',
              children: [
                {
                  href: '/admin/products',
                  label: t('productsList'),
                  active: pathname === '/admin/products',
                },
                {
                  href: '/admin/products/new',
                  label: t('newProduct'),
                  active: pathname === '/admin/products/new',
                },
              ],
            },
            {
              href: '/admin/auctions',
              label: t('auctions'),
              active: pathname.includes('/admin/auctions'),
              icon: '',
              children: [],
            },
            {
              href: '/admin/store-settings',
              label: t('settings'),
              active: pathname.includes('/admin/store-settings'),
              icon: '',
              children: [],
            },
          ],
        },
      ],
    },
  ];
}
export function getHorizontalMenuList(
  pathname: string,
  t: (key: string) => string
): Group[] {
  return [
    {
      groupLabel: t('adminDashboard'),
      id: 'adminDashboard',
      menus: [
        {
          id: 'admin',
          href: '/admin',
          label: t('adminDashboard'),
          active: pathname.includes('/admin'),
          icon: 'heroicons-outline:home',
          submenus: [],
        },
      ],
    },
  ];
}
