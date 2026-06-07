import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  // ✅ THIS IS REQUIRED in Next 16
  turbopack: {},

  webpack(config) {
    return config;
  },
};

export default withPWA(nextConfig);