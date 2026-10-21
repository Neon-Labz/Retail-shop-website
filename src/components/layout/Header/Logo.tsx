import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}

export function Logo({
  href = '/',
  src = '/rkf-logo.png',
  alt = 'RKF Distributer',
  width,
  height,
  style,
}: LogoProps = {}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center no-underline leading-none"
    >
      <Image
        src={src}
        alt={alt}
        width={width ?? 120}
        height={height ?? 65}
        priority
        className={`w-auto max-h-[70px] object-contain ${height ? '' : 'h-[62px]'}`}
        style={height || style ? { ...(height ? { height: `${height}px` } : {}), ...style } : undefined}
      />
    </Link>
  );
}
