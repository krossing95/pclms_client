/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    swcMinify: true
}

module.exports = nextConfig
