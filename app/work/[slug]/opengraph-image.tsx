import { listCaseStudyProjects } from "@/lib/content";
import { SITE_NAME } from "@/lib/site/pages";
import { renderShareImage } from "@/lib/site/share-image";

// Prerendered at build time, like the page it previews.
export const dynamic = "force-static";
export const dynamicParams = false;

export const alt = `A Case Study on ${SITE_NAME}'s portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return listCaseStudyProjects().map((project) => ({
    slug: project.caseStudySlug!,
  }));
}

export default async function Image(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  return renderShareImage(`/work/${slug}`);
}
