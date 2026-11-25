import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/inspo',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
