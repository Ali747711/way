import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  reactStrictMode: true,
  experimental: {
    // Each language has its own root layout, so there is no single layout
    // to wrap the 404 page; app/global-not-found.tsx supplies the document.
    globalNotFound: true
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css'
      }
    }
  }
};

export default nextConfig;
