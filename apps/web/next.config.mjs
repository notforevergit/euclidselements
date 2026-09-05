/** @type {import('next').NextConfig} */
const nextConfig = {
  // The workspace packages ship TypeScript source, not a build. Next compiles
  // them with the app, which means no build step in packages/* and no stale
  // dist/ to get out of sync. Jest picks this list up through next/jest.
  transpilePackages: [
    '@straightedge/content',
    '@straightedge/geometry',
    '@straightedge/ui',
  ],
};

export default nextConfig;
