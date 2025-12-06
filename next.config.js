/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/backend/:path*',
                destination: 'https://721bms2s-8000.inc1.devtunnels.ms/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
