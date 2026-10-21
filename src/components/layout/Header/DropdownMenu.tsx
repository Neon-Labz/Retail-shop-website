import Link from 'next/link';
import type { NavigationChild } from '@/types/common';

interface DropdownMenuProps {
  items: NavigationChild[];
  bg?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  onClose?: () => void;
}

export function DropdownMenu({ items, bg = '#fff', textColor = '#444', borderColor = '#f0f0f0', hoverColor = '#F15B41', onClose }: DropdownMenuProps) {
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('a')) {
      onClose?.();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className="absolute top-full min-w-[260px] border rounded-b-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.08)] z-[300] py-[14px] animate-[menuSlideDown_300ms_ease-out]"
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
      }}
    >
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          onClick={() => onClose?.()}
          className="block py-[10px] px-[24px] text-[15px] no-underline transition-[color] duration-150 ease-in-out whitespace-nowrap"
          style={{
            color: textColor,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = textColor; }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
