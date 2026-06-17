import AuthForm from '@/components/Auth/AuthForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Account — Prince's Closet",
  description: "Join Prince's Closet and start shopping the latest sustainable fashion.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#4A3129] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthForm initialMode="signup" />
    </Suspense>
  );
}
