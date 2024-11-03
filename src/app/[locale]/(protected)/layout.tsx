import LayoutProvider from '@/providers/layout.provider';
import LayoutContentProvider from '@/providers/content.provider';
import DashbordSidebar from '@/components/core/admin/partials/sidebar';
import DashboradFooter from '@/components/core/admin/partials/footer';
import DashbordHeader from '@/components/core/admin/partials/header';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session) {
    redirect('/');
  }
  return (
    <LayoutProvider>
      <DashbordHeader />
      <DashbordSidebar />
      <LayoutContentProvider>{children}</LayoutContentProvider>
      <DashboradFooter />
    </LayoutProvider>
  );
};

export default layout;
