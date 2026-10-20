import type { MetadataRoute } from "next";
import { jogos } from "@/lib/jogos";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    ...jogos.map((j) => ({ url: `${site.url}/${j.id}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${site.url}/album`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
