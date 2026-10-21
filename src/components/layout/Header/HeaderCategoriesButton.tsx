'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CategoriesCascadingMenu } from './CategoriesCascadingMenu';
import { IconHamburger } from '@/lib/icons';

export function HeaderCategoriesButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
      className="header-categories-btn-container relative inline-flex items-center ml-[12px]"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="All Categories Menu"
        aria-expanded={isOpen}
        className={`inline-flex items-center gap-[8px] px-[14px] py-[8px] border-[1.5px] rounded-[6px] text-[14px] font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap leading-none ${
          isOpen
            ? 'bg-[#111] text-white border-[#222]'
            : 'bg-white text-[#111] border-[#222] hover:bg-[#f8f8f8] hover:border-[#F15B41] hover:text-[#F15B41]'
        }`}
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
