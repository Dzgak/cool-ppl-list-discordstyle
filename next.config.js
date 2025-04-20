/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['discord.com', 'cdn.discordapp.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'discord.com',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
