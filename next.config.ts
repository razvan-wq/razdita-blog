import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
    assetPrefix: 'https://blog.razdita.com',
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
