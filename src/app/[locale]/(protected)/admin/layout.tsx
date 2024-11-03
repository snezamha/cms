import PageTitle from '@/components/core/admin/breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '',
  description: '',
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageTitle className='mb-6' />
      {children}
    </>
  );
};

export default Layout;
