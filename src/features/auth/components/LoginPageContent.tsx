'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const ACCENT = '#c96742';
const DARK = '#111111';

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
    <div className="li-page-wrapper">
      <div className="li-main-container">
        <div className="li-card">
          {/* Header */}
          <div className="li-header">
            <span className="li-badge">WELCOME BACK</span>
            <h1 className="li-title">Log in to your account</h1>
            <p className="li-subtitle">
              Enter your credentials to manage your orders.
            </p>
          </div>

          {error && (
            <div className="li-alert-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="li-form" noValidate>
            {/* Email Field */}
            <div className="li-field-wrap">
              <label className="li-label" htmlFor="login-email">
                Email Address <span className="li-req">*</span>
              </label>
              <div className="li-input-box">
                <span className="li-input-icon">
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
                  className="li-input"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="li-field-wrap">
              <div className="li-label-row">
                <label className="li-label" htmlFor="login-password">
                  Password <span className="li-req">*</span>
                </label>
                <Link href="/reset-password" className="li-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="li-input-box">
                <span className="li-input-icon">
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
                  className="li-input li-input-pw"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="li-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="li-remember-row">
              <label className="li-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="li-checkbox"
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="li-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="li-btn-loading">
                  <span className="li-spinner" />
                  Logging in...
                </span>
              ) : (
                'Log in'
              )}
            </button>

            {/* Register below login button */}
            <div className="li-divider">
              <span className="li-divider-line" />
              <span className="li-divider-text">Don&apos;t have an account?</span>
              <span className="li-divider-line" />
            </div>

            <Link href="/register" className="li-register-btn">
              <span>Register an Account</span>
              <IconArrowRight />
            </Link>
          </form>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: liStyles }} />
    </div>
  );
}

const liStyles = `
  /* ── Lock window scroll completely ── */
  html:has(.li-page-wrapper),
  body:has(.li-page-wrapper) {
    overflow: hidden !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }

  .li-page-wrapper {
    background-color: #f8fafc;
    height: calc(100vh - 68px);
    max-height: calc(100vh - 68px);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    overflow: hidden;
    padding: 0 1.6rem;
    box-sizing: border-box;
  }

  /* ── Main Container: Perfectly Centered ── */
  .li-main-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  /* ── Card Container: Elegantly proportioned fixed container ── */
  .li-card {
    width: 100%;
    max-width: 440px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 1.2rem;
    padding: 3.2rem 3rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 20px -5px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }

  /* ── Form Header ── */
  .li-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  .li-badge {
    display: inline-block;
    background: #fdf3ef;
    color: ${ACCENT};
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.25rem 0.9rem;
    border-radius: 2rem;
    margin-bottom: 0.8rem;
  }
  .li-title {
    font-size: 2.15rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
    margin: 0 0 0.5rem;
    line-height: 1.25;
  }
  .li-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    line-height: 1.45;
    margin: 0;
  }

  /* ── Form Controls ── */
  .li-form {
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
  }
  .li-field-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .li-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .li-label {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  .li-req {
    color: #ef4444;
  }
  .li-forgot-link {
    font-size: 1.2rem;
    color: ${ACCENT};
    font-weight: 500;
    text-decoration: none;
    transition: color 0.15s;
  }
  .li-forgot-link:hover {
    text-decoration: underline;
  }

  /* ── Input Box & Icon ── */
  .li-input-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .li-input-icon {
    position: absolute;
    left: 1.2rem;
    color: #94a3b8;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .li-input {
    width: 100%;
    height: 4.4rem;
    padding: 0 1.4rem 0 3.8rem;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 1.35rem;
    color: #0f172a;
    font-family: inherit;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .li-input:-webkit-autofill,
  .li-input:-webkit-autofill:hover, 
  .li-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #0f172a !important;
  }
  .li-input:focus {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(201, 103, 66, 0.15);
  }
  .li-input::placeholder {
    color: #94a3b8;
  }
  .li-input:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }
  .li-input-pw {
    padding-right: 4.2rem;
  }
  .li-eye-btn {
    position: absolute;
    right: 0.9rem;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.4rem;
    transition: color 0.15s;
  }
  .li-eye-btn:hover {
    color: #334155;
  }

  /* ── Remember Me Checkbox ── */
  .li-remember-row {
    display: flex;
    align-items: center;
    margin-top: -0.2rem;
  }
  .li-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 1.25rem;
    color: #475569;
    cursor: pointer;
    user-select: none;
  }
  .li-checkbox {
    width: 1.5rem;
    height: 1.5rem;
    accent-color: ${ACCENT};
    cursor: pointer;
  }

  /* ── Submit Button ── */
  .li-submit-btn {
    width: 100%;
    height: 4.6rem;
    background: ${DARK};
    color: #ffffff;
    font-size: 1.45rem;
    font-weight: 600;
    border: none;
    border-radius: 0.75rem;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: 0.01em;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-top: 0.1rem;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
  .li-submit-btn:hover:not(:disabled) {
    background: #2a2a2a;
    transform: translateY(-1px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.14);
  }
  .li-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .li-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .li-btn-loading {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .li-spinner {
    width: 1.6rem;
    height: 1.6rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: liSpin 0.7s linear infinite;
  }
  @keyframes liSpin {
    to { transform: rotate(360deg); }
  }

  /* ── Divider ── */
  .li-divider {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    margin: 0.35rem 0;
  }
  .li-divider-line {
    flex: 1;
    height: 1px;
    background-color: #e2e8f0;
  }
  .li-divider-text {
    font-size: 1.15rem;
    color: #64748b;
    font-weight: 500;
  }

  /* ── Register Button CTA ── */
  .li-register-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
    width: 100%;
    height: 4.4rem;
    background: #ffffff;
    color: #0f172a !important;
    border: 1.5px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 1.35rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  }
  .li-register-btn:hover {
    border-color: ${ACCENT};
    color: ${ACCENT} !important;
    background-color: #fff9f6;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(201, 103, 66, 0.1);
  }

  /* ── Alert Error ── */
  .li-alert-error {
    background-color: #fef2f2;
    border: 1px solid #fee2e2;
    color: #991b1b;
    padding: 0.8rem 1.1rem;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    line-height: 1.4;
  }

  /* ── Security Trust Footer ── */
  .li-secure-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #94a3b8;
    font-size: 1.15rem;
    margin-top: 0.2rem;
  }

  /* ── Responsive ── */
  @media (max-height: 680px) {
    .li-card {
      padding: 1.6rem 2.2rem;
    }
    .li-header {
      margin-bottom: 1rem;
    }
    .li-form {
      gap: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .li-card {
      padding: 2rem 1.6rem;
      border-radius: 1rem;
    }
  }
`;
