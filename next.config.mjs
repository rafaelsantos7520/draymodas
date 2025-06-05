/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '**', // ou especifique a porta se souber (ex: '3000')
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ttqdzaytkyyfbopqkzgt.supabase.co',
        pathname: '/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    unoptimized: true,
  },
  
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    // removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig
