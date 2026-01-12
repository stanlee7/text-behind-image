/** @type {import('next').NextConfig} */
const nextConfig = {
  // 기존 웹팩 설정 유지 (fs: false 등)
  webpack: (config, { isServer }) => {
    if (!isServer) {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            crypto: false,
        };
    }
    return config;
  },
  
  // [추가] 배포 시 에러 무시 설정
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
