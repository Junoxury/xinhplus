import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'web.babitalk.com',
      },
      {
        protocol: 'https',
        hostname: 'images.babitalk.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      }
    ],
  },
}

export default nextConfig 