import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Gerado uma vez no build (exigido pelo export estático do GitHub Pages)
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
