/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",   // ✅ ADD HERE

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },
};

export default nextConfig;