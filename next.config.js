/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    async redirects() {
        return [
            {
                source: '/register/verify',
                missing: [
                    {
                        type: 'cookie',
                        key: '__successfullyRegistered'
                    }
                ],
                permanent: false,
                destination: '/register',
            },
            {
                source: '/register/:path*',
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
                destination: '/register',
            }
        ]
    }
}

module.exports = nextConfig
