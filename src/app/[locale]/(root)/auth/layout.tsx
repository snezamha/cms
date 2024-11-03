import React from 'react';
import { Session } from 'next-auth';
import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';

export default async function authLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = (await auth()) as Session;

  if (session && session.user.role === 'ADMIN') {
    redirect('/admin');
  } else if (session && session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <section className='w-full max-w-md'>{children}</section>
    </div>
  );
}
