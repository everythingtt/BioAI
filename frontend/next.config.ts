import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // We'll keep static export for simplicity, but remove the sub-directory paths
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
