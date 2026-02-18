import type { NextConfig } from "next";
import path from "path";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Monorepo kökünü Next'e açıkça bildirerek
  // yanlış workspace root tahminine bağlı uyarıyı engelle
  outputFileTracingRoot: path.join(__dirname, ".."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default withPWA(nextConfig);
