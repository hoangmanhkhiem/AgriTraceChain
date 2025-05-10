/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Bật hỗ trợ WebAssembly
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    return config;
  },
}

export default nextConfig
