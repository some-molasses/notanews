/** @type {import('next').NextConfig} */
const nodeExternals = require("webpack-node-externals");

const nextConfig = {
  redirects: () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
  rewrites: async () => {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:5328/api/:path*"
            : "/api/",
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = [nodeExternals()];
    }

    return config;
  },
};

module.exports = nextConfig;
