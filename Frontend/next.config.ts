import type { NextConfig } from "next";

const getIP = () => {
  if (typeof window !== "undefined") {
    return window.location.hostname;
  }
  return "localhost"; // Fallback for server-side rendering
};

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/applicant", permanent: true }];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `http://${getIP()}:8000/api/:path*`, // Added /api/ to match backend routes
      },
    ];
  },
};

export default nextConfig;
