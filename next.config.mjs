/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,    
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000'
      },
      {
        hostname: 'via.placeholder.com',
        pathname: '/**'
      }
    ]
  }
}

export default nextConfig
