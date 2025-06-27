import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (session) {
    redirect('/admin');
  }
  
  return (
    <>
        {children}
    </>
  )

}