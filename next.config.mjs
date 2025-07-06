/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  }
}

export default nextConfig
