/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  assetPrefix: './',
  experimental: {
    optimizePackageImports: ['react', 'react-dom']
  }
}

export default nextConfig
