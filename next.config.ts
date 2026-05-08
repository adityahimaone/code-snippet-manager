/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Turbopack config
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
