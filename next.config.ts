import type { NextConfig } from "next";

// Detecta se estamos rodando em ambiente de desenvolvimento
const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  output: 'export',

  images: {
    unoptimized: true, 
  },

  basePath: isDev ? '' : '/my-conference-tracker',
};

export default nextConfig;