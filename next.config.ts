import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      // Development - localhost
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001',
        pathname: '/uploads/**',
      },
      // Production - add your production domain here
      {
        protocol: 'https',
        hostname: 'your-production-domain.com', // Replace with your actual production domain
        pathname: '/uploads/**',
      },
      // Alternative: If you're using a different production setup
      {
        protocol: 'https',
        hostname: 'api.your-domain.com', // Replace with your actual API domain
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
