import type { MetadataRoute } from "next";
import { absoluteUrl, listPages } from "@/lib/site/pages";

// Prerendered at build time, like every route (next.config.ts: output "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return listPages().map((page) => ({ url: absoluteUrl(page.path) }));
}
