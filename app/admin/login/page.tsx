'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugData, setDebugData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/setup')
      .then((res) => res.json())
      .then((data) => console.log('[Admin Setup]:', data))
      .catch((err) => console.error('[Admin Setup Error]:', err));

    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => setDebugData(data))
      .catch((err) => setDebugData({ error: err.message }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError('Invalid email or password.');
        return;
      }

      // After sign-in, middleware will verify admin access.
      // If not admin, server will respond 403.
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#4a3129] flex items-center justify-center p-4">
      {debugData && (
        <pre className="absolute top-4 left-4 right-4 bg-black text-green-400 p-4 text-xs overflow-auto max-h-60 z-50">
          {JSON.stringify(debugData, null, 2)}
        </pre>
      )}
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-14 w-14 bg-white/10 mb-4">
            <Shirt size={28} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-white font-bold text-xl tracking-widest uppercase">StyleAdmin</h1>
          <p className="text-white/50 text-xs mt-1 uppercase tracking-widest">Prince's Closet — Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#f4f0ea] p-8">
          <h2 className="text-[#4a3129] font-bold text-sm uppercase tracking-widest mb-8">Sign In</h2>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 text-xs font-medium">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            <div className="flex flex-col gap-2 group">
              <label htmlFor="admin-email" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@princescloset.com"
                className="bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] text-sm outline-none focus:border-[#4a3129] transition-all placeholder:text-[#4a3129]/30"
              />
            </div>

            <div className="flex flex-col gap-2 group">
              <label htmlFor="admin-password" className="text-[10px] uppercase tracking-widest font-bold text-[#4a3129]/60 group-focus-within:text-[#4a3129] transition-colors">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent border-b border-[#dfcac3] pb-3 text-[#4a3129] text-sm outline-none focus:border-[#4a3129] transition-all placeholder:text-[#4a3129]/30 pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-3 text-[#4a3129]/40 hover:text-[#4a3129] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-[#4a3129] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#3A241C] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In to Admin'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-[10px] mt-6 uppercase tracking-widest">
          Access restricted to authorized admins only
        </p>
      </div>
    </div>
  );
}
