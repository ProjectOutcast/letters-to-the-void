import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  serverExternalPackages: ["better-sqlite3", "sharp"],
  async redirects() {
    return [
      {
        source: "/posts/:slug",
        destination: "/letters/:slug",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
