import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Keep tracing rooted on this app, not C:\Users\Dev_zart\pnpm-lock.yaml
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        // About dossier lives on the landing page
        source: "/about",
        destination: "/#features",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
