import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { caseStudyDemo } from "@/components/case-study/demos";
import { listCaseStudyProjects } from "@/lib/content";

// Every Case Study prerenders at build time; an unknown slug is a 404, never a runtime lookup.
export const dynamicParams = false;

export function generateStaticParams() {
  return listCaseStudyProjects().map((project) => ({
    slug: project.caseStudySlug!,
  }));
}

function findProject(slug: string) {
  return listCaseStudyProjects().find(
    (project) => project.caseStudySlug === slug,
  );
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: `${project.name}: Case Study — John Robin Cubi`,
    description: project.caseStudy.lede,
  };
}

export default async function WorkPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();
  return (
    <CaseStudyPage
      project={project}
      caseStudy={project.caseStudy}
      demo={caseStudyDemo(slug)}
    />
  );
}
