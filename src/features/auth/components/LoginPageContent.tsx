'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';


function IconMail() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconArrowRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function LoginPageContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lock body & html scroll while on login page to guarantee zero-scroll
  useEffect(() => {
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.body.style.overflow = origBodyOverflow;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }

      router.push('/');
    } catch {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 h-[calc(100vh-68px)] max-h-[calc(100vh-68px)] flex items-center justify-center w-full overflow-hidden px-4 box-border">
      <div className="w-full max-w-full flex justify-center items-center box-border">
        <div className="w-full max-w-[440px] mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.06)] box-border">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <span className="inline-block bg-[#fdf3ef] text-[#c96742] text-[1.1rem] font-bold tracking-wider px-3.5 py-1 rounded-full mb-2 uppercase">
              WELCOME BACK
            </span>
            <h1 className="text-2xl sm:text-[2.15rem] font-bold text-slate-900 tracking-tight mb-1.5 leading-tight">
              Log in to your account
            </h1>
            <p className="text-sm sm:text-[1.25rem] text-slate-500 leading-normal m-0">
              Enter your credentials to manage your orders.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-[1.25rem] mb-4 flex items-center gap-3 leading-snug" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="login-email">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <IconMail />
                </span>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 sm:h-12 pl-11 pr-4 bg-white border border-slate-300 rounded-xl text-sm sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="login-password">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link href="/reset-password" className="text-xs sm:text-[1.2rem] text-[#c96742] font-medium hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center w-full">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none">
                  <IconLock />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 sm:h-12 pl-11 pr-12 bg-white border border-slate-300 rounded-xl text-sm sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors disabled:cursor-not-allowed cursor-pointer"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center -mt-0.5">
              <label className="inline-flex items-center gap-2 text-xs sm:text-[1.25rem] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#c96742] rounded cursor-pointer"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 bg-[#111111] hover:bg-[#2a2a2a] text-white text-sm sm:text-[1.45rem] font-semibold rounded-xl tracking-wide flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>

            {/* Register below login button */}
            <div className="flex items-center gap-3 my-0.5">
              <span className="flex-1 h-px bg-slate-200" />
              <span className="text-xs sm:text-[1.15rem] text-slate-500 font-medium">Don&apos;t have an account?</span>
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            <Link href="/register" className="inline-flex items-center justify-center gap-2 w-full h-11 sm:h-12 bg-white text-slate-900 border border-slate-300 rounded-xl text-sm sm:text-[1.35rem] font-semibold hover:border-[#c96742] hover:text-[#c96742] hover:bg-[#fff9f6] transition-all duration-150 shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 no-underline cursor-pointer">
              <span>Register an Account</span>
              <IconArrowRight />
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

