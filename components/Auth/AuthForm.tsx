'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

type Mode = 'login' | 'signup';

export default function AuthForm({ initialMode = 'login' }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isLogin = mode === 'login';

  const inputClass =
    'w-full bg-transparent border-b border-[#4a3129]/30 focus:border-[#4A3129] outline-none py-3 text-[14px] text-[#4a3129] placeholder:text-[#4a3129]/40 transition-colors duration-300';

  return (
    <div className="min-h-screen flex bg-[#f4f0ea]">

      {/* ── Left panel — brand image ── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#2a1f1a]">
        <Image
          src="/images/img_2.png"
          alt="Prince's Closet"
          fill
          className="object-cover opacity-60"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a1f1a]/80 via-[#4a3129]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <Link href="/" className="heading text-[#f4f0ea] text-[22px] uppercase tracking-wide">
            Prince&apos;s Closet
          </Link>

          {/* Quote */}
          <div>
            <blockquote className="heading text-[#f4f0ea] text-[28px] xl:text-[36px] leading-snug mb-6 max-w-sm">
              &ldquo;Style is a way to say who you are without having to speak.&rdquo;
            </blockquote>
            <p className="text-[#f4f0ea]/50 text-[13px] uppercase tracking-widest">
              — Rachel Zoe
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-16 min-h-screen">

        {/* Mobile logo */}
        <Link href="/" className="heading text-[#4A3129] text-[20px] uppercase tracking-wide mb-12 lg:hidden block">
          Prince&apos;s Closet
        </Link>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-10 border-b border-[#4a3129]/15 w-full max-w-sm">
          {(['login', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`relative pb-3 mr-8 text-[13px] uppercase tracking-widest font-normal transition-colors duration-300 ${
                mode === m ? 'text-[#4A3129]' : 'text-[#4a3129]/40 hover:text-[#4a3129]/70'
              }`}
            >
              {m === 'login' ? 'Sign In' : 'Create Account'}
              {mode === m && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-[1.5px] bg-[#4A3129]"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Heading */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode + '-heading'}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mb-10"
          >
            <h1 className="heading text-[#4A3129] uppercase text-[28px] md:text-[36px] leading-tight">
              {isLogin ? 'Welcome back' : 'Join the Closet'}
            </h1>
            <p className="text-[13px] text-[#4a3129]/55 mt-2">
              {isLogin
                ? 'Sign in to access your orders, wishlist, and account.'
                : 'Create your account and start shopping with style.'}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex flex-col gap-7 w-full max-w-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name fields — signup only */}
            {!isLogin && (
              <div className="flex gap-5">
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="Prince"
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Doe"
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className={`${inputClass} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-0 bottom-3 text-[#4a3129]/40 hover:text-[#4a3129] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password — signup only */}
            {!isLogin && (
              <div>
                <label className="text-[11px] uppercase tracking-widest text-[#4a3129]/50 block mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className={`${inputClass} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-0 bottom-3 text-[#4a3129]/40 hover:text-[#4a3129] transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot password — login only */}
            {isLogin && (
              <div className="flex justify-end -mt-3">
                <button
                  type="button"
                  className="text-[11px] uppercase tracking-widest text-[#4a3129]/45 hover:text-[#4a3129] transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms checkbox — signup only */}
            {!isLogin && (
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-4 h-4 border border-[#4a3129]/40 peer-checked:bg-[#4A3129] peer-checked:border-[#4A3129] transition-all duration-200" />
                  <svg
                    className="absolute inset-0 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                    fill="none" viewBox="0 0 16 16"
                  >
                    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[12px] text-[#4a3129]/55 leading-relaxed">
                  I agree to the{' '}
                  <span className="text-[#4a3129] underline underline-offset-2 cursor-pointer">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-[#4a3129] underline underline-offset-2 cursor-pointer">Privacy Policy</span>
                </span>
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="group w-full bg-[#4A3129] text-white uppercase text-[12px] font-normal py-4 tracking-widest hover:bg-[#3a2520] transition-all duration-300 flex items-center justify-center gap-3 mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-[#4a3129]/10" />
              <span className="text-[11px] uppercase tracking-widest text-[#4a3129]/30">or</span>
              <div className="flex-1 h-px bg-[#4a3129]/10" />
            </div>

            {/* Google SSO */}
            <button
              type="button"
              className="w-full border border-[#4a3129]/25 text-[#4a3129] uppercase text-[12px] font-normal py-4 tracking-widest hover:border-[#4a3129] hover:bg-[#e3dbcf] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Switch mode */}
            <p className="text-center text-[12px] text-[#4a3129]/45 mt-2">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => setMode(isLogin ? 'signup' : 'login')}
                className="text-[#4a3129] underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>

          </motion.form>
        </AnimatePresence>
      </div>
    </div>
  );
}
