/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.rebrickable.com', 'img.bricklink.com'],
  },
  experimental: {
    typedRoutes: true,
  },
};

module.exports = nextConfig;