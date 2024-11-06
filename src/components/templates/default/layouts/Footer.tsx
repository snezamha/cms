import { getTranslations } from 'next-intl/server';

const Footer = async () => {
  const t = await getTranslations('Footer');

  return (
    <footer className='bg-white border-t'>
      <div className='mx-auto py-10'>
        <p className='text-center text-xs text-black'>
          {t('footerText1', { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
