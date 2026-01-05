import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  productionBrowserSourceMaps: false,
  images: {
    domains: ["covers.openlibrary.org", "books.google.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${
          process.env.BACKEND_URL ?? "http://localhost:4000"
        }/api/v1/:path*`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
