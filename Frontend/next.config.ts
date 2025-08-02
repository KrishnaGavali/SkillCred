import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/applicant", permanent: true }];
  },
};

export default nextConfig;
