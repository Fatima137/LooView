import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/looview-6k3nm.firebasestorage.app/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: [
    "https://9000-firebase-looview-1747674896685.cluster-ubrd2huk7jh6otbgyei4h62ope.cloudworkstations.dev",
    "http://localhost:9002",
  ],


};

export default nextConfig;