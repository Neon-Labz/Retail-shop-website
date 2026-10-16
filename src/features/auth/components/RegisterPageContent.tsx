'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const ACCENT = '#c96742';
const DARK = '#111111';

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
    <div className="rg-page-wrapper">
      <div className="rg-main-container">
        <div className="rg-card">
          <div className="rg-header">
            <span className="rg-badge">JOIN US</span>
            <h1 className="rg-title">Create your account</h1>
            <p className="rg-subtitle">
              Sign up today for early sale access, order tracking, and faster checkout.
            </p>
          </div>

          {error && (
            <div className="rg-alert rg-alert-error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="rg-alert rg-alert-success" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <form className="rg-form" onSubmit={handleSubmit}>
            {/* Row 1: First + Last Name */}
            <div className="rg-row-2">
              <div className="rg-field-wrap">
                <label className="rg-label" htmlFor="reg-first-name">
                  First Name <span className="rg-req">*</span>
                </label>
                <div className="rg-input-box">
                  <span className="rg-input-icon"><IconUser /></span>
                  <input
                    id="reg-first-name"
                    type="text"
                    required
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rg-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="rg-field-wrap">
                <label className="rg-label" htmlFor="reg-last-name">
                  Last Name
                </label>
                <div className="rg-input-box">
                  <span className="rg-input-icon"><IconUser /></span>
                  <input
                    id="reg-last-name"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rg-input"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email + Phone */}
            <div className="rg-row-2">
              <div className="rg-field-wrap">
                <label className="rg-label" htmlFor="reg-email">
                  Email Address <span className="rg-req">*</span>
                </label>
                <div className="rg-input-box">
                  <span className="rg-input-icon"><IconMail /></span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rg-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="rg-field-wrap">
                <label className="rg-label" htmlFor="reg-phone">
                  Phone Number <span className="rg-req">*</span>
                </label>
                <div className="rg-input-box">
                  <span className="rg-input-icon"><IconPhone /></span>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="rg-input"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Password */}
            <div className="rg-field-wrap">
              <label className="rg-label" htmlFor="reg-password">
                Password <span className="rg-req">*</span>
              </label>
              <div className="rg-input-box">
                <span className="rg-input-icon"><IconLock /></span>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rg-input rg-input-pw"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="rg-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="rg-terms-row">
              <label className="rg-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rg-checkbox"
                />
                <span>
                  I agree to the{' '}
                  <Link href="/pages/privacy-policy" className="rg-link">Privacy Policy</Link>
                  {' '}and{' '}
                  <Link href="/pages/terms-of-service" className="rg-link">Terms</Link>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="rg-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="rg-btn-loading">
                  <span className="rg-spinner" />
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="rg-footer-login">
            <span>Already have an account?</span>
            <Link href="/login" className="rg-login-link">
              Log in here →
            </Link>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: rgStyles }} />
    </div>
  );
}

const rgStyles = `
  /* ── Lock window scroll completely ── */
  html:has(.rg-page-wrapper),
  body:has(.rg-page-wrapper) {
    overflow: hidden !important;
    height: 100vh !important;
    max-height: 100vh !important;
  }

  .rg-page-wrapper {
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
  .rg-main-container {
    width: 100%;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  /* ── Main Card ── */
  .rg-card {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 1.2rem;
    padding: 2.8rem 3.2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 20px -5px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }

  .rg-header {
    text-align: center;
    margin-bottom: 1.8rem;
  }
  .rg-badge {
    display: inline-block;
    background: #fdf3ef;
    color: ${ACCENT};
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 0.2rem 0.85rem;
    border-radius: 2rem;
    margin-bottom: 0.6rem;
  }
  .rg-title {
    font-size: 2.15rem;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.01em;
    margin: 0 0 0.4rem;
    line-height: 1.25;
  }
  .rg-subtitle {
    font-size: 1.25rem;
    color: #64748b;
    line-height: 1.45;
    margin: 0;
  }

  /* ── Alerts ── */
  .rg-alert {
    padding: 0.8rem 1.1rem;
    border-radius: 0.75rem;
    font-size: 1.25rem;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    line-height: 1.4;
  }
  .rg-alert-error {
    background-color: #fef2f2;
    border: 1px solid #fee2e2;
    color: #991b1b;
  }
  .rg-alert-success {
    background-color: #f0fdf4;
    border: 1px solid #dcfce7;
    color: #166534;
  }

  /* ── Form Controls ── */
  .rg-form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }
  .rg-row-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;
  }
  .rg-field-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }
  .rg-label {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
  }
  .rg-req {
    color: #ef4444;
  }

  .rg-input-box {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }
  .rg-input-icon {
    position: absolute;
    left: 1.2rem;
    color: #94a3b8;
    display: flex;
    align-items: center;
    pointer-events: none;
  }
  .rg-input {
    width: 100%;
    height: 4.2rem;
    padding: 0 1.2rem 0 3.6rem;
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    border-radius: 0.75rem;
    font-size: 1.35rem;
    color: #0f172a;
    font-family: inherit;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }
  .rg-input:-webkit-autofill,
  .rg-input:-webkit-autofill:hover, 
  .rg-input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px #fff inset !important;
    -webkit-text-fill-color: #0f172a !important;
  }
  .rg-input:focus {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(201, 103, 66, 0.15);
  }
  .rg-input::placeholder {
    color: #94a3b8;
  }
  .rg-input:disabled {
    background-color: #f8fafc;
    cursor: not-allowed;
  }
  .rg-input-pw {
    padding-right: 4rem;
  }
  .rg-eye-btn {
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
  .rg-eye-btn:hover {
    color: #334155;
  }

  /* ── Terms Checkbox ── */
  .rg-terms-row {
    display: flex;
    align-items: center;
    margin-top: -0.2rem;
  }
  .rg-checkbox-label {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    font-size: 1.2rem;
    color: #475569;
    cursor: pointer;
    user-select: none;
  }
  .rg-checkbox {
    width: 1.5rem;
    height: 1.5rem;
    accent-color: ${ACCENT};
    cursor: pointer;
  }
  .rg-link {
    color: ${ACCENT};
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .rg-link:hover {
    color: #a84e2c;
  }

  /* ── Submit Button ── */
  .rg-submit-btn {
    width: 100%;
    height: 4.5rem;
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
    margin-top: 0.2rem;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
  }
  .rg-submit-btn:hover:not(:disabled) {
    background: #2a2a2a;
    transform: translateY(-1px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.14);
  }
  .rg-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .rg-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .rg-btn-loading {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }
  .rg-spinner {
    width: 1.6rem;
    height: 1.6rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: rgSpin 0.7s linear infinite;
  }
  @keyframes rgSpin { to { transform: rotate(360deg); } }

  /* ── Footer Link ── */
  .rg-footer-login {
    margin-top: 1.6rem;
    padding-top: 1.3rem;
    border-top: 1px solid #f1f5f9;
    text-align: center;
    font-size: 1.3rem;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.7rem;
  }
  .rg-login-link {
    color: ${ACCENT};
    font-weight: 600;
    text-decoration: none;
    transition: color 0.15s;
  }
  .rg-login-link:hover { text-decoration: underline; }

  @media (max-height: 720px) {
    .rg-card {
      padding: 1.8rem 2.4rem;
    }
    .rg-header {
      margin-bottom: 1.2rem;
    }
    .rg-form {
      gap: 0.9rem;
    }
  }

  @media (max-width: 520px) {
    .rg-row-2 {
      grid-template-columns: 1fr;
      gap: 1.2rem;
    }
    .rg-card {
      padding: 2.2rem 1.8rem;
      border-radius: 1rem;
    }
  }
`;
