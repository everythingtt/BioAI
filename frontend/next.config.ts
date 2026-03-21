import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Removed output: "export" to support dynamic routes on Vercel
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
