'use client';

import { useState } from 'react';

export function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      setStatus('success');
      setMessage('Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Error subscribing');
    }
  };

  return (
    <div>
      <h4 className="text-[1.6rem] font-semibold mb-[1.6rem] text-white">Newsletter</h4>
      <p className="text-[1.3rem] text-white/70 mb-[1.6rem]">
        Write your email first to know about any information.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex-1 flex items-center bg-white/10 rounded-s-[var(--radius-md)] px-[1.2rem]">
          <span className="text-white/50 text-[1.4rem] me-[0.8rem]">✉</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-transparent text-[1.3rem] text-white placeholder:text-white/40 py-[1rem] outline-none"
            required
            disabled={status === 'loading'}
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-primary hover:bg-primary-hover text-white px-[1.6rem] rounded-e-[var(--radius-md)] text-[1.6rem] transition-colors"
          aria-label="Subscribe"
        >
          {status === 'loading' ? '...' : '→'}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-[1.2rem] text-[#34d399] mt-[0.8rem]">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-[1.2rem] text-[#f87171] mt-[0.8rem]">{message}</p>
      )}
    </div>
  );
}
