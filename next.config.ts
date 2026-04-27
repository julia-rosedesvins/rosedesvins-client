import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache optimised images for 30 days
    remotePatterns: [
      // Development - localhost API
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      // Production API server (uploaded files)
      {
        protocol: 'https',
        hostname: 'api.rosedesvins.co',
        pathname: '/uploads/**',
      },
      // AWS S3 bucket - rosedesvins (us-east-1)
      {
        protocol: 'https',
        hostname: 'rosedesvins.s3.us-east-1.amazonaws.com',
        pathname: '/**',
      },
      // AWS S3 path-style URLs (fallback)
      {
        protocol: 'https',
        hostname: 's3.us-east-1.amazonaws.com',
        pathname: '/rosedesvins/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Long-term cache for all static assets in /public
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
