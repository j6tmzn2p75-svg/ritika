import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow larger request bodies for media uploads
  serverExternalPackages: [],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
