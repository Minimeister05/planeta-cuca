import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Adicione aqui as páginas novas conforme o site crescer
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
