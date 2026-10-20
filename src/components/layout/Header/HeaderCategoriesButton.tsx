'use client';

import { useState, useRef, useEffect } from 'react';
import { CategoriesCascadingMenu } from './CategoriesCascadingMenu';

function IconHamburger({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function HeaderCategoriesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  /* Original hover handlers commented out: user requested click-to-open only
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 180);
  };
  */

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="header-categories-btn-container"
      /* Original hover triggers commented out:
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      */
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '12px',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="All Categories Menu"
        aria-expanded={isOpen}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          backgroundColor: isOpen ? '#111' : '#fff',
          color: isOpen ? '#fff' : '#111',
          border: '1.5px solid #222',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 200ms ease',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#f8f8f8';
            e.currentTarget.style.borderColor = '#F15B41';
            e.currentTarget.style.color = '#F15B41';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.borderColor = '#222';
            e.currentTarget.style.color = '#111';
          }
        }}
      >
        <IconHamburger size={17} />
        <span className="header-categories-text">All Categories</span>
      </button>

      {isOpen && (
        <CategoriesCascadingMenu
          align="left"
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default HeaderCategoriesButton;
