import type { MetadataRoute } from "next";

// Keep crawlers away from auth/callback and private dashboard routes.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/dashboard/"] }],
  };
}
