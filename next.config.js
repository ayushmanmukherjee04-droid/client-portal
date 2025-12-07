/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                // User authentication service (port 8002)
                source: '/backend/api/AaaS/user/:path*',
                destination: 'https://721bms2s-8002.inc1.devtunnels.ms/api/AaaS/user/:path*',
            },
            {
                // Main backend - login, apps, etc. (port 8000)
                source: '/backend/:path*',
                destination: 'https://721bms2s-8000.inc1.devtunnels.ms/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
