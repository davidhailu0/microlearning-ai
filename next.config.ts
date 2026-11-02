import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app is DB-backed and user-specific; opt out of the new static-shell
  // defaults so route handlers and server components always see fresh data.
  cacheComponents: false,
  partialPrefetching: false,
  serverExternalPackages: ["unpdf", "adm-zip", "cheerio"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
