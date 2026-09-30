/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Handle MediaPipe WASM and binary asset resolutions
    config.resolve.fallback = { ...config.resolve.fallback, fs: false, path: false };
    return config;
  },
};

export default nextConfig;
