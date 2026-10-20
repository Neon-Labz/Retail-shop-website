import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  /** Override the logo's click-target. Default: "/". */
  href?: string;
  /** Override the logo image. Default: RKF logo. */
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

/* Previous Logo implementation commented out:
export function OldLogo({ href = '/', src = '/logo.jpg', alt = 'RKF' }: LogoProps = {}) {
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
        width={65}
        height={60}
        priority
        style={{ objectFit: 'contain', width: 'auto', height: '48px', maxHeight: '48px' }}
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
