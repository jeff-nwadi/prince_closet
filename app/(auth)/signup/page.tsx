import AuthForm from '@/components/Auth/AuthForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Create Account — Prince's Closet",
  description: "Join Prince's Closet and start shopping the latest sustainable fashion.",
};

export default function SignupPage() {
  return <AuthForm initialMode="signup" />;
}
