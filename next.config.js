/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // For GitHub Pages deployment, set basePath to your repo name
  // basePath: '/your-repo-name',
  // assetPrefix: '/your-repo-name/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
