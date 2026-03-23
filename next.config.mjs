/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This ignores linting errors (like unused variables) during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This ignores TypeScript type errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;