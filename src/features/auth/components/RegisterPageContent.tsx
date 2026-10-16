'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';


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

function IconUser() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
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

export function RegisterPageContent() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Lock body & html scroll while on register page to guarantee zero-scroll
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
    setSuccess(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the privacy policy & terms of service.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to register account');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        useAuthStore.getState().setUser(data.user);
      }

      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch {
      setError('A network error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 h-[calc(100vh-68px)] max-h-[calc(100vh-68px)] flex items-center justify-center w-full overflow-hidden px-4 box-border">
      <div className="w-full max-w-full flex justify-center items-center box-border">
        <div className="w-full max-w-[500px] mx-auto bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.06)] box-border">
          <div className="text-center mb-4 sm:mb-5">
            <span className="inline-block bg-[#fdf3ef] text-[#c96742] text-[1.05rem] font-bold tracking-wider px-3 py-0.5 rounded-full mb-1.5 uppercase">
              JOIN US
            </span>
            <h1 className="text-xl sm:text-[2.1rem] font-bold text-slate-900 tracking-tight mb-1 leading-tight">
              Create your account
            </h1>
            <p className="text-xs sm:text-[1.2rem] text-slate-500 leading-normal m-0">
              Sign up today for early sale access, order tracking, and faster checkout.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3.5 py-2.5 rounded-xl text-[1.2rem] mb-3 flex items-center gap-2.5 leading-snug" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-3.5 py-2.5 rounded-xl text-[1.2rem] mb-3 flex items-center gap-2.5 leading-snug" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form className="flex flex-col gap-3 sm:gap-3.5" onSubmit={handleSubmit}>
            {/* Row 1: First + Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="reg-first-name">
                  First Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none"><IconUser /></span>
                  <input
                    id="reg-first-name"
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full h-10 sm:h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="reg-last-name">
                  Last Name
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none"><IconUser /></span>
                  <input
                    id="reg-last-name"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full h-10 sm:h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="reg-email">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none"><IconMail /></span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 sm:h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="reg-phone">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center w-full">
                  <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none"><IconPhone /></span>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-10 sm:h-11 pl-11 pr-3 bg-white border border-slate-300 rounded-xl text-xs sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password */}
            <div className="flex flex-col gap-1">
              <label className="text-xs sm:text-[1.25rem] font-semibold text-slate-800" htmlFor="reg-password">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center w-full">
                <span className="absolute left-3.5 text-slate-400 flex items-center pointer-events-none"><IconLock /></span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 sm:h-11 pl-11 pr-11 bg-white border border-slate-300 rounded-xl text-xs sm:text-[1.35rem] text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#c96742] focus:ring-2 focus:ring-[#c96742]/15 disabled:bg-slate-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-700 rounded transition-colors disabled:cursor-not-allowed cursor-pointer"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center -mt-0.5">
              <label className="inline-flex items-center gap-2 text-xs sm:text-[1.2rem] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 accent-[#c96742] rounded cursor-pointer"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/pages/privacy-policy" className="text-[#c96742] underline underline-offset-2 hover:text-[#a84e2c]">Privacy Policy</Link>
                  {' '}and{' '}
                  <Link href="/pages/terms-of-service" className="text-[#c96742] underline underline-offset-2 hover:text-[#a84e2c]">Terms</Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-11 sm:h-12 bg-[#111111] hover:bg-[#2a2a2a] text-white text-sm sm:text-[1.4rem] font-semibold rounded-xl tracking-wide flex items-center justify-center transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-0.5"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-3 pt-3 border-t border-slate-100 text-center text-xs sm:text-[1.3rem] text-slate-500 flex items-center justify-center gap-2">
            <span>Already have an account?</span>
            <Link href="/login" className="text-[#c96742] font-semibold hover:underline no-underline transition-colors">
              Log in here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

