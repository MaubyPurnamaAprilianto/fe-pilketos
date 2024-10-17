/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001', // Sesuaikan dengan port backend yang kamu gunakan
        pathname: '/getImage/**',  // Sesuaikan path untuk gambar
      },
    ],
  }
}

module.exports = nextConfig
