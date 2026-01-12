/** @type {import('next').NextConfig} */
const nextConfig = {
    // Transformers.js가 브라우저에서 잘 돌도록 Webpack 설정 오버라이드
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,   // 파일 시스템 접근 차단 (브라우저용)
                path: false,
                crypto: false,
            };
        }
        return config;
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
