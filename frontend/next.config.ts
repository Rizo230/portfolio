import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["portfolio.lab", "localhost"],
  output: "standalone",
};

export default nextConfig;
