import React from 'react';
import FooterContent from './footer-content';
import { getTranslations } from 'next-intl/server';

const DashboradFooter = async () => {
  const t = await getTranslations('Footer');

  return (
    <FooterContent>
      <div className=' md:flex  justify-between text-default-600 hidden'>
        <div className='text-center ltr:md:text-start rtl:md:text-right text-sm'>
          {t('footerText1', { year: new Date().getFullYear() })}
        </div>
        <div className='ltr:md:text-right rtl:md:text-end text-center text-sm'>
          {t('footerText2')}{' '}
          <a
            href='mailto:snezamha@gmail.com'
            target='_blank'
            className='text-primary font-semibold'
          >
            sNezamHa
          </a>
        </div>
      </div>
      <div className='flex md:hidden justify-around text-xs items-center text-center'>
        {t('footerText1', { year: new Date().getFullYear() })}
      </div>
    </FooterContent>
  );
};

export default DashboradFooter;
