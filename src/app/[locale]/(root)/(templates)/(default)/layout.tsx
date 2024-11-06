import Footer from '@/components/templates/default/layouts/Footer';
import Navbar from '@/components/templates/default/layouts/Navbar';
import { getSessionOrThrow } from '@/server/auth';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

export default async function DefaultLayout({ children }: DefaultLayoutProps) {
  const session = await getSessionOrThrow();
  return (
    <div>
      <Navbar user={session?.user} />
      <div>{children}</div>
      <Footer />
    </div>
  );
}
