import type { MetadataRoute } from "next";
import { jogos } from "@/lib/jogos";
import { site } from "@/lib/site";

// Gerado uma vez no build (exigido pelo export estático do GitHub Pages)
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...jogos.map((j) => ({ url: `${site.url}/${j.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/album`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
