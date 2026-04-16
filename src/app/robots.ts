import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/agent/"],
      },
    ],
    sitemap: "https://www.mulkeef.com/sitemap.xml",
    host: "https://www.mulkeef.com",
  };
}
