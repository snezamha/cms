import DashboardBreadcrumb from '@/components/core/admin/breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '',
  description: '',
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardBreadcrumb />
      {children}
    </>
  );
};

export default Layout;
