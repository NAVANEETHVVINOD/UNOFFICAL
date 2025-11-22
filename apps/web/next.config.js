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
};

module.exports = nextConfig;
