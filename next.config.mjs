/** @type {import('next').NextConfig} */
const nextConfig = {
    // Turbopack does not support custom webpack config yet, 
    // so we rely on dynamic imports in the code to handle browser/node conflicts.
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
