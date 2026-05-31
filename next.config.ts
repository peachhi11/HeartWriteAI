import type { NextConfig } from "next";
const isProd = process.env.NODE_ENV === "production";

const internalHost = process.env.TAURI_DEV_HOST || "localhost";
const devPort = process.env.NEXT_DEV_PORT || process.env.PORT || "3001";
const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  output: "export",
  // Note: This feature is required to use the Next.js Image component in SSG mode.
  // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
  images: {
    unoptimized: true,
  },
  // Configure assetPrefix or else the server won't properly resolve your assets.
  assetPrefix: isProd ? undefined : `http://${internalHost}:${devPort}`,
  allowedDevOrigins: ["127.0.0.1"],
  /* config options here */
};

export default nextConfig;
