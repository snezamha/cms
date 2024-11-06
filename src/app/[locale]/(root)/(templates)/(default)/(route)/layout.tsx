import ClientProvider from '@/components/templates/default/providers/ClientProvider';

export default async function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientProvider>
      <div className='mx-auto max-w-7xl'>{children}</div>
    </ClientProvider>
  );
}
