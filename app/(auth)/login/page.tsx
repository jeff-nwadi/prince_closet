import AuthForm from '@/components/Auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In — Prince's Closet",
  description: "Sign in to your Prince's Closet account to access your orders, wishlist, and profile.",
};

export default function LoginPage() {
  return <AuthForm initialMode="login" />;
}
