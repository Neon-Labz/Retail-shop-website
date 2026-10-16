'use client';

import Link from 'next/link';
import { useState } from 'react';

function ArrowDiag() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function ResetPasswordPageContent() {
  const [email, setEmail] = useState('');

  return (
    <div className="w-full">
      {/* ── Hero ── */}
      <div className="py-14 sm:py-16 text-center bg-gradient-to-br from-white via-[#fdf4f0] to-[#fde8df]">
        <h1 className="text-3xl sm:text-5xl font-normal text-gray-900 tracking-wide">
          Log in
        </h1>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-start">
          {/* ── Left: Reset form ── */}
          <section>
            <h2 className="text-2xl sm:text-[2.4rem] font-bold text-gray-900 mb-4">
              Reset your password
            </h2>
            <p className="text-sm sm:text-[1.35rem] text-gray-600 leading-relaxed mb-6">
              We will send you an email to reset your password
            </p>
            <form className="flex flex-col gap-4 max-w-md" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded px-4 text-sm sm:text-[1.4rem] text-gray-900 bg-white outline-none transition-colors focus:border-gray-500 placeholder-gray-400"
              />
              <div>
                <Link href="/login" className="text-sm sm:text-[1.35rem] text-gray-900 underline underline-offset-4 hover:text-[#c96742] transition-colors">
                  Cancel
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="h-12 min-w-[200px] bg-[#111111] hover:bg-[#333333] text-white text-sm sm:text-[1.5rem] font-semibold rounded px-8 tracking-wide transition-colors cursor-pointer"
                >
                  Reset password
                </button>
              </div>
            </form>
          </section>

          {/* ── Right: New user ── */}
          <section>
            <h2 className="text-2xl sm:text-[2.4rem] font-bold text-gray-900 mb-4">
              I&apos;m new here
            </h2>
            <p className="text-sm sm:text-[1.35rem] text-gray-600 leading-relaxed mb-4">
              Sign up for early{' '}
              <span className="text-[#c96742] font-medium">Sale</span>{' '}
              access plus tailored new arrivals, trends and promotions. To opt out,
              click unsubscribe in our emails.
            </p>
            <Link
              href="/register"
              className="text-sm sm:text-[1.4rem] font-bold text-gray-900 underline underline-offset-4 inline-flex items-center gap-1 hover:text-[#c96742] transition-colors"
            >
              <span>Register</span>
              <ArrowDiag />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
