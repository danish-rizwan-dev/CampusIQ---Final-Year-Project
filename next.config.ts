import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    position: 'bottom-right',
  },
  // Allow development origin for HMR on local IP
  allowedDevOrigins: ['192.168.1.6'],
};

export default nextConfig;
