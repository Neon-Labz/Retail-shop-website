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
      <div className="py-[5.5rem] text-center bg-gradient-to-br from-white via-[#fdf4f0] to-[#fde8df]">
        <h1 className="text-[3rem] sm:text-[4rem] font-normal text-[#222222] tracking-[0.01em]">
          Log in
        </h1>
      </div>

      <div className="max-w-[1320px] mx-auto px-[1.6rem] pt-[6rem] pb-[8rem]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem] md:gap-[8rem] items-start">
          {/* ── Left: Reset form ── */}
          <section>
            <h2 className="text-[2.4rem] font-bold text-[#222222] mb-[1.6rem]">
              Reset your password
            </h2>
            <p className="text-[1.35rem] text-[#555555] leading-[1.6] mb-[2rem]">
              We will send you an email to reset your password
            </p>
            <form className="flex flex-col gap-[1.6rem] max-w-[42rem]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[4.8rem] border border-[#d5d5d5] rounded-[0.3rem] px-[1.4rem] text-[1.4rem] text-[#222222] bg-white outline-none transition-colors focus:border-[#888888] placeholder-[#bbbbbb]"
              />
              <div>
                <Link href="/login" className="text-[1.35rem] text-[#222222] underline underline-offset-[3px] hover:text-[#c96742] transition-colors">
                  Cancel
                </Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="h-[5rem] min-w-[20rem] bg-[#111111] hover:bg-[#333333] text-white text-[1.5rem] font-semibold rounded-[0.4rem] px-[3.2rem] tracking-[0.02em] transition-colors cursor-pointer"
                >
                  Reset password
                </button>
              </div>
            </form>
          </section>

          {/* ── Right: New user ── */}
          <section>
            <h2 className="text-[2.4rem] font-bold text-[#222222] mb-[1.6rem]">
              I&apos;m new here
            </h2>
            <p className="text-[1.35rem] text-[#555555] leading-[1.65] mb-[1.6rem]">
              Sign up for early{' '}
              <span className="text-[#c96742] font-medium">Sale</span>{' '}
              access plus tailored new arrivals, trends and promotions. To opt out,
              click unsubscribe in our emails.
            </p>
            <Link
              href="/register"
              className="text-[1.4rem] font-bold text-[#222222] underline underline-offset-[3px] inline-flex items-center gap-[0.4rem] hover:text-[#c96742] transition-colors"
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
