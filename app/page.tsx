import type { Metadata } from "next";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";
import { Experience } from "@/components/experience";
import { Hero } from "@/components/hero";
import { ProjectSpread } from "@/components/project-spread";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StackIndex } from "@/components/stack-index";
import {
  getAboutBody,
  getStack,
  listExperience,
  listFeaturedProjects,
} from "@/lib/content";
import { pageMetadata } from "@/lib/site/metadata";

export const metadata: Metadata = pageMetadata("/");

export default function Home() {
  const projects = listFeaturedProjects();
  const stack = getStack();
  const experience = listExperience();
  const about = getAboutBody();

  return (
    <>
      <SiteHeader />
      <Hero />
      <main id="work">
        {projects.map((project, index) => (
          <ProjectSpread
            key={project.slug}
            project={project}
            plateNumber={index + 1}
            alt={index % 2 === 1}
          />
        ))}
      </main>
      <StackIndex stack={stack} />
      <Experience entries={experience} />
      <About body={about} />
      <Contact />
      <SiteFooter />
    </>
  );
}
