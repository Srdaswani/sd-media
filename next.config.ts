import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Images are delivered straight from Cloudinary with f_auto/q_auto and an
  // explicit srcset, so Next's own optimizer is not in the path. This keeps us
  // off Vercel's image-transformation quota entirely — the site stays free
  // no matter how much traffic it takes.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default config;
