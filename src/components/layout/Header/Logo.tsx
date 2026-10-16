import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  /** Override the logo's click-target. Default: "/". */
  href?: string;
  /** Override the logo image. Default: RKF logo. */
  src?: string;
  /** Alt text for the logo image. */
  alt?: string;
}

export function Logo({ href = '/', src = '/logo.jpg', alt = 'RKF' }: LogoProps = {}) {
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
