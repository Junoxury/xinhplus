import withPWA from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
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
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image2.gnsister.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'developers.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'maps.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'aladuargqrfwfpfpfmti.supabase.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
  ...withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
  }),
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
}

export default nextConfig 