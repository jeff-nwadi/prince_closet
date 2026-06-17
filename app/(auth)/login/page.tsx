import AuthForm from '@/components/Auth/AuthForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In — Prince's Closet",
  description: "Sign in to your Prince's Closet account to access your orders, wishlist, and profile.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#4A3129] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthForm initialMode="login" />
    </Suspense>
  );
}
