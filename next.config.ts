import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
  },
  serverExternalPackages: ["better-sqlite3", "sharp"],
};

export default nextConfig;
