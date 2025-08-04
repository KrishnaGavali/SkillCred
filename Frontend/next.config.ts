import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/applicant", permanent: true }];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Match all /api routes
        destination: "http://localhost:8000/:path*", // Proxy to localhost:800
      },
    ];
  },
};

export default nextConfig;
