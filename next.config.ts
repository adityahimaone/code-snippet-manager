/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Turbopack config
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
