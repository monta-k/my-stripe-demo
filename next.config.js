/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true
  },
  env: {
    BASE_PATH: process.env.BASE_PATH
  }
}

module.exports = nextConfig
