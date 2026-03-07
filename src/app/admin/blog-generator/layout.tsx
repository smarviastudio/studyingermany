import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { isAdminEmail } from '@/lib/admin';

export default async function BlogGeneratorLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/signin?callbackUrl=/admin/blog-generator');
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
