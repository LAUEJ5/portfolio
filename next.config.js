/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If you're deploying to a subdirectory (like username.github.io/personal-portfolio)
  // uncomment and modify the line below:
  // basePath: '/personal-portfolio',
}

module.exports = nextConfig
