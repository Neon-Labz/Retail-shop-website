import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  /** Override the logo's click-target. Default: "/". */
  href?: string;
  /** Override the logo image. Default: fashion theme logo. */
  src?: string;
  /** Alt text for the logo image. */
  alt?: string;
  /** Optional width override */
  width?: number;
  /** Optional height override */
  height?: number;
  /** Optional style override */
  style?: React.CSSProperties;
}

/* Original Logo component commented out as requested:
export function Logo({ href = '/', src = '/fashion/logo/logo1.webp', alt = 'Ambaz' }: LogoProps = {}) {
  return (
    <Link
      href={href}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={130}
        height={36}
        priority
        style={{ objectFit: 'contain' }}
      />
    </Link>
  );
}
*/

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
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        lineHeight: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width ?? 120}
        height={height ?? 65}
        priority
        style={{
          height: height ? `${height}px` : '62px',
          width: 'auto',
          maxHeight: '70px',
          objectFit: 'contain',
          ...style,
        }}
      />
    </Link>
  );
}
