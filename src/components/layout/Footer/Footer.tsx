'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Cairo } from 'next/font/google';
import { useClickOutside } from '@/hooks/useClickOutside';
import { FOOTER_LINKS } from '@/lib/constants';
import {
  IconTwitterX,
  IconFacebook,
  IconInstagram,
  IconTikTok,
  IconLinkedIn,
  IconChevronDown,
  IconSriLankaFlag,
  IconArrowRight,
  IconMail,
  IconPlusMobile,
  PaymentIcons,
} from '@/lib/icons';

const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-cairo',
  display: 'swap',
});

interface FooterColumnProps {
  id: string;
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isPizza?: boolean;
}
function FooterColumn({ id, title, expanded, onToggle, children, isPizza }: FooterColumnProps) {
  return (
    <div className={`ft-col border-0${isPizza ? ' ft-col-pizza' : ''}`}>
      <button
        type="button"
        className={`ft-col-head block text-[20px] font-bold mb-[18px] cursor-default bg-transparent border-0 p-0 max-[749px]:w-full max-[749px]:flex max-[749px]:items-center max-[749px]:justify-between max-[749px]:m-0 max-[749px]:p-[4px] max-[749px]:cursor-pointer max-[749px]:text-[18px] ${
          isPizza ? 'text-white' : 'text-[#222]'
        }`}
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`ft-col-body-${id}`}
      >
        <span>{title}</span>
        <span
          className={`ft-col-toggle hidden max-[749px]:inline-flex ${
            isPizza ? 'text-white' : 'text-[#222]'
          }`}
        >
          <IconPlusMobile open={expanded} />
        </span>
      </button>
      <div
        id={`ft-col-body-${id}`}
        className={`ft-col-body block overflow-visible max-[749px]:grid max-[749px]:transition-all max-[749px]:duration-300 ${
          expanded
            ? 'is-open max-[749px]:grid-rows-[1fr] max-[749px]:opacity-100'
            : 'max-[749px]:grid-rows-[0fr] max-[749px]:opacity-0'
        }`}
      >
        <div
          className={`ft-col-body-inner p-0 max-[749px]:overflow-hidden max-[749px]:min-h-0 ${
            expanded ? 'max-[749px]:pt-[8px] max-[749px]:px-[4px] max-[749px]:pb-[4px]' : 'max-[749px]:px-[4px]'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
function UpwardDropdown({ selected, options, onSelect, isRtl, textColor = '#555', itemColor = '#222', triggerClassName, itemClassName }: { selected: string; options: string[]; onSelect: (v: string) => void; isRtl?: boolean; textColor?: string; itemColor?: string; triggerClassName?: string; itemClassName?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setIsOpen(false));
  useEffect(() => { if (!isOpen) return; const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); }; document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h); }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-[6px] text-[14px] py-[10px] px-[20px] border border-[#ddd] rounded-[40px] bg-white cursor-pointer transition-[border-color] duration-200 ease-in-out ${triggerClassName ?? ''}`}
        style={{ color: textColor }}
      >
        {selected}
        <span className={`inline-flex transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <IconChevronDown />
        </span>
      </button>
      {isOpen && (
        <div
          className={`absolute bottom-[calc(100%+8px)] ${isRtl ? 'right-0' : 'left-0'} min-w-[240px] bg-white border border-[#f0f0f0] shadow-[0_-6px_24px_rgba(0,0,0,0.1)] py-[14px] z-[50] animate-[ftDropUp_200ms_ease-out]`}
        >
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setIsOpen(false); }}
              className={`block w-full ${isRtl ? 'text-right' : 'text-left'} py-[10px] px-[24px] text-[16px] bg-transparent border-none cursor-pointer transition-[color] duration-200 ease-in-out ${itemClassName ?? ''}`}
              style={{ color: itemColor }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F15B41'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = itemColor; }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function FooterNewsletterForm({ isPizza, isRtlDemo }: { isPizza: boolean; isRtlDemo: boolean }) {
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
    <form onSubmit={handleSubmit} className="max-w-[380px]">
      <div
        className={`flex items-center border rounded-[40px] py-[10px] ${
          isRtlDemo ? 'pr-[20px] pl-[14px]' : 'pl-[20px] pr-[14px]'
        } ${
          isPizza
            ? 'border-[#3a3a3a] bg-[rgb(30,30,30)]'
            : 'border-[#ddd] bg-white'
        }`}
      >
        <span
          className={`flex shrink-0 ${
            isRtlDemo ? 'ml-[10px]' : 'mr-[10px]'
          } ${isPizza ? 'text-white/40' : 'text-[#999]'}`}
        >
          <IconMail />
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === 'loading'}
          className={`flex-1 text-[15px] border-none outline-none bg-transparent min-w-0 ${
            isPizza ? 'text-white/70' : 'text-[#777]'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={`flex items-center justify-center bg-transparent border-none cursor-pointer shrink-0 transition-colors duration-200 ${
            isPizza
              ? 'text-white/75 hover:text-[#e84d1c]'
              : 'text-[#222] hover:text-[#F15B41]'
          }`}
        >
          {status === 'loading' ? (
            <span className="w-[14px] h-[14px] border-2 border-t-transparent border-current rounded-full animate-spin" />
          ) : (
            <IconArrowRight />
          )}
        </button>
      </div>
      {status === 'success' && (
        <p className="text-[13px] text-[#10b981] mt-[8px] font-medium">{message}</p>
      )}
      {status === 'error' && (
        <p className="text-[13px] text-[#ef4444] mt-[8px] font-medium">{message}</p>
      )}
    </form>
  );
}

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  const isPizza = pathname?.startsWith('/pizza') || pathname?.startsWith('/home/pizza-shop');
  const isRtlDemo = pathname?.startsWith('/home/rtl-demo-shop');
  const isMegastore = pathname?.startsWith('/megastore') || pathname?.startsWith('/home/megastore-shop');
  const [currency, setCurrency] = useState('Bangladesh USD $');
  const [language, setLanguage] = useState('English');
  const [openCols, setOpenCols] = useState<Record<string, boolean>>({});
  const toggleCol = (id: string) =>
    setOpenCols((p) => ({ ...p, [id]: !p[id] }));

  const socials = [
    { Icon: IconTwitterX, label: 'Twitter' },
    { Icon: IconFacebook, label: 'Facebook' },
    { Icon: IconInstagram, label: 'Instagram' },
    { Icon: IconTikTok, label: 'TikTok' },
    { Icon: IconLinkedIn, label: 'LinkedIn' },
  ];

  const fc = isPizza
    ? { text: 'rgba(255,255,255,0.7)', head: '#fff', icon: 'rgba(255,255,255,0.75)', divider: 'rgba(255,255,255,0.1)', newsletterBg: 'rgb(30,30,30)', newsletterBorder: '#3a3a3a', mailIcon: 'rgba(255,255,255,0.4)', linkHover: '#e84d1c' }
    : { text: '#777', head: '#222', icon: '#222', divider: '#e0e0e0', newsletterBg: '#fff', newsletterBorder: '#ddd', mailIcon: '#999', linkHover: '#F15B41' };

  return (
    <footer
      dir={isRtlDemo ? 'rtl' : 'ltr'}
      className={`${isRtlDemo ? `${cairo.variable} font-[var(--font-cairo),sans-serif]` : ''} ${
        isPizza ? 'bg-[rgb(20,20,20)]' : 'bg-[rgb(247,248,252)]'
      }`}
    >
      <div className={`container-main ${isPizza ? 'py-[80px]' : 'py-[30px]'}`}>
        <div className="footer-grid grid grid-cols-4 max-[749px]:grid-cols-1 gap-0">
          <FooterColumn id="about" title="About us" expanded={!!openCols.about} onToggle={() => toggleCol('about')} isPizza={isPizza}>
            <p className={`text-[15px] leading-[1.7] mb-[20px] ${isPizza ? 'text-white/70' : 'text-[#777]'}`}>
              RKF Wholesale &amp; Retail Distributer is your trusted partner in Sri Lanka for quality toys, party supplies, home essentials, and stationery at the best wholesale and retail prices.
            </p>
            <div className="flex items-center gap-[14px]">
              {socials.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={`flex transition-colors duration-200 ${
                    isPizza
                      ? 'text-white/75 hover:text-[#e84d1c]'
                      : 'text-[#222] hover:text-[#F15B41]'
                  }`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn id="quick" title="Quick Links" expanded={!!openCols.quick} onToggle={() => toggleCol('quick')} isPizza={isPizza}>
            <div className="flex flex-col gap-[12px] max-[749px]:gap-[20px]">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[15px] no-underline transition-colors duration-200 ${
                    isPizza
                      ? 'text-white/70 hover:text-[#e84d1c]'
                      : 'text-[#777] hover:text-[#F15B41]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn id="company" title="Company" expanded={!!openCols.company} onToggle={() => toggleCol('company')} isPizza={isPizza}>
            <div className="flex flex-col gap-[12px] max-[749px]:gap-[20px]">
              {FOOTER_LINKS.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[15px] no-underline transition-colors duration-200 ${
                    isPizza
                      ? 'text-white/70 hover:text-[#e84d1c]'
                      : 'text-[#777] hover:text-[#F15B41]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </FooterColumn>

          <FooterColumn id="newsletter" title="Newsletter" expanded={!!openCols.newsletter} onToggle={() => toggleCol('newsletter')} isPizza={isPizza}>
            <p className={`text-[15px] leading-[1.7] mb-[20px] ${isPizza ? 'text-white/70' : 'text-[#777]'}`}>
              Write your email first to know about any information.
            </p>
            <FooterNewsletterForm isPizza={isPizza} isRtlDemo={isRtlDemo} />
          </FooterColumn>
        </div>
      </div>

      <div className="container-main">
        <div className={`border-t ${isPizza ? 'border-white/10' : 'border-[#e0e0e0]'}`} />
      </div>

      <div className={`container-main ${isPizza ? 'py-[40px]' : 'py-[24px]'}`}>
        <div className="footer-bottom-grid grid grid-cols-3 max-[749px]:grid-cols-1 max-[749px]:gap-[20px] max-[749px]:text-center items-center">
          <div className="flex flex-wrap items-center gap-[12px] gap-y-[10px] max-[749px]:justify-self-center">
            <div
              className={`inline-flex items-center gap-[8px] text-[14px] px-[18px] py-[9px] rounded-[40px] font-medium border ${
                isPizza
                  ? 'text-white border-white/20 bg-[rgb(30,30,30)]'
                  : 'text-[#222] border-[#ddd] bg-white'
              }`}
            >
              <IconSriLankaFlag />
              <span>Sri Lanka</span>
              <span
                className={`text-[11px] font-bold tracking-[0.04em] px-[7px] py-[2px] text-white rounded-[12px] leading-[1.2] ${
                  isPizza ? 'bg-white/15' : 'bg-[#F15B41]'
                }`}
              >
                LKR
              </span>
            </div>
          </div>

          <p
            className={`text-[14px] text-center ${
              isPizza ? 'text-white/70' : 'text-[#777]'
            }`}
          >
            2026, Developed by{' '}
            <a
              href="https://theneonlabz.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-inherit no-underline font-medium transition-colors duration-200 ${
                isPizza ? 'hover:text-[#e84d1c]' : 'hover:text-[#F15B41]'
              }`}
            >
              NeonLabz (Pvt) Ltd.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
