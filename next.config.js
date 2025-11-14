/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  // Cloudflare Pages compatibility
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  trailingSlash: true,
}

module.exports = nextConfig
