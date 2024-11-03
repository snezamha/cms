'use client';
import React from 'react';
import { Link, usePathname } from '@/components/core/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
// import { Icon } from '@/components/ui/icon';
import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';

const DashboardBreadcrumb = ({ children }: { children?: ReactNode }) => {
  const location = usePathname();
  const locations = location.split('/').filter((path) => path);
  const scopedT = useTranslations('adminBreadcrumb');
  return (
    <div className='flex justify-between gap-3 items-center px-4 md:px-8 mb-1'>
      <div className='flex-1'>
        <Breadcrumb>
          <BreadcrumbList>
            {locations.map((link, index) => {
              const isMongoId = /^[a-f\d]{24}$/i.test(link);
              const href = `/${locations.slice(0, index + 1).join('/')}`;
              const itemLink = isMongoId ? 'update' : link;
              const isLast = index === locations.length - 1;
              return (
                <React.Fragment key={index}>
                  {link === 'admin' ? (
                    <>
                      <BreadcrumbItem>
                        <Link href={href}>
                          {/* <Icon icon='heroicons:home' className='h-5 w-5' /> */}
                          {scopedT('adminDashboard')}
                        </Link>
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </>
                  ) : (
                    <>
                      <BreadcrumbItem className='capitalize'>
                        {isLast ? (
                          scopedT(itemLink)
                        ) : (
                          <Link href={href}>{scopedT(itemLink)}</Link>
                        )}
                      </BreadcrumbItem>
                      {locations.length !== index + 1 && (
                        <BreadcrumbSeparator />
                      )}
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className=' flex-none flex  gap-2'>{children}</div>
    </div>
  );
};

export default DashboardBreadcrumb;
