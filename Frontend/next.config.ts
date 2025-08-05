import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/applicant", permanent: true }];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*", // Added /api/ to match backend routes
      },
    ];
  },
};

export default nextConfig;
