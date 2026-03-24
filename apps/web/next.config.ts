import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@twitter-agent/core"],
  typedRoutes: true
};

export default nextConfig;
