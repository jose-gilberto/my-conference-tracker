import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true, 
  },

  basePath: '/my-conference-tracker',
};

export default nextConfig;