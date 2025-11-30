import type { NextConfig } from "next";

// nvalid src prop (https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1600&q=80) on `next/image`, hostname "images.unsplash.com" is not configured under images in your `next.config.js`
const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  /* config options here */
};

export default nextConfig;
