/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["tailwindcss"],
  },
};

module.exports = nextConfig;