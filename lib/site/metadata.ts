import type { Metadata } from "next";
import { SITE_NAME, SITE_URL, getPage } from "./pages";

/** Metadata that holds for every page; the root layout sets it once. */
export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  robots: { index: true, follow: true },
  openGraph: { siteName: SITE_NAME, type: "website", locale: "en_PH" },
  twitter: { card: "summary_large_image" },
};

/**
 * A page's title, description, canonical URL and link-preview tags. The share
 * image comes from the `opengraph-image` file beside each route, so it isn't named here.
 * Open Graph and Twitter are set per page because a page's own `openGraph` replaces
 * the root layout's rather than merging with it.
 */
export function pageMetadata(path: string): Metadata {
  const { title, description } = getPage(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...siteMetadata.openGraph,
      title,
      description,
      url: path,
    },
    twitter: { ...siteMetadata.twitter, title, description },
  };
}
