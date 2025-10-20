/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['imagedelivery.net', 'i.imgur.com'],
  },
  // Set outputFileTracingRoot to fix workspace warning
  outputFileTracingRoot: require('path').join(__dirname),
}

module.exports = nextConfig

