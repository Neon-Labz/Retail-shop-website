import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/shop',
        destination: '/products',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
