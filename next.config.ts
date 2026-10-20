import type { NextConfig } from "next";

// No GitHub Pages o site vira arquivos estáticos (pasta out/) e mora numa subpasta, ex.: /planeta-cuca
const basePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  ...(basePath !== undefined && { output: "export", basePath, trailingSlash: true }),
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
