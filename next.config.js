/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: "/",
      destination: "/login",
      permanent: true,
    },
  ],
};

module.exports = nextConfig;
