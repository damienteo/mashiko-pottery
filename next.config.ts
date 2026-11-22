import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  agentRules: false,
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
      },
    ],
  },
}

// ✅ Log APP_ENV during build
console.log(
  '✅ APP_ENV from next.config.js (process.env.NODE_ENV =',
  process.env.NODE_ENV,
  ') → APP_ENV =',
  process.env.APP_ENV
)

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
