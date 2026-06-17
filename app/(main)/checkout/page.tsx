import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | Prince Closet',
  description: 'Complete your premium sustainable apparel purchase securely.',
};

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login?callbackUrl=/checkout');
  }

  return <CheckoutClient user={session.user} />;
}
