/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    swcMinify: true,
    async redirects() {
        return [
            {
                source: '/auth',
                permanent: false,
                destination: '/auth/register',
            },
            {
                source: '/auth/register/verify',
                missing: [
                    {
                        type: 'cookie',
                        key: '__requesting_verification'
                    }
                ],
                permanent: false,
                destination: '/auth/register',
            },
            {
                source: '/auth/login/verify',
                missing: [
                    {
                        type: 'cookie',
                        key: '__requesting_verification'
                    }
                ],
                permanent: false,
                destination: '/auth/login',
            },
            {
                source: '/auth/:path*',
                has: [
                    {
                        type: 'cookie',
                        key: '__signedInUserObj'
                    }
                ],
                permanent: false,
                destination: '/system/dashboard',
            },
            {
                source: '/system/:path*',
                missing: [
                    {
                        type: 'cookie',
                        key: '__signedInUserObj'
                    }
                ],
                permanent: false,
                destination: '/auth/register',
            }
        ]
    }
}

module.exports = nextConfig
