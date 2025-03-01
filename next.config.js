/** @type {import('next').NextConfig} */
// To ignore linting during builds
const nextConfig = {
    images: {
      unoptimized: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;