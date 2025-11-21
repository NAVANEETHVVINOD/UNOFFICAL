/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  compiler: {
    styledComponents: true,
  },
  // Server Actions are enabled by default in recent Next.js versions
  // Remove experimental.serverActions to avoid the invalid option warning
}

module.exports = nextConfig
