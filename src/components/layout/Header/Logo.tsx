import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  /** Override the logo's click-target. Default: "/". */
  href?: string;
  /** Override the logo image. Default: fashion theme logo. */
  src?: string;
  /** Alt text for the logo image. */
  alt?: string;
}

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
