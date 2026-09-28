import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statically generated: no server functions, no runtime data (spec.md
  // "Platform and build"). `output: "export"` makes the build itself fail
  // if a route ever needs a server.
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
