import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // Allow local uploaded images served from /public/uploads
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
