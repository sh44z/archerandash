import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure MongoDB connection works in serverless environment
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
