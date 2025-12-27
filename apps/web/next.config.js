/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Disable styled-jsx fully
  compiler: {
    styledJsx: false,
  },

  // Force dynamic rendering (fixes 404/500 prerender crash)
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },

  // Serve .well-known directory for Digital Asset Links (TWA verification)
  async headers() {
    return [
      {
        source: '/.well-known/assetlinks.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
