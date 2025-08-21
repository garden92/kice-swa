import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/kice-swa' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kice-swa' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
