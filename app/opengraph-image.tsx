import { getPage } from "@/lib/site/pages";
import { renderShareImage } from "@/lib/site/share-image";

// Prerendered at build time, like the page it previews.
export const dynamic = "force-static";

export const alt = getPage("/").title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderShareImage("/");
}
