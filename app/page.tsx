import { Hero } from "@/components/hero";
import { ProjectSpread } from "@/components/project-spread";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { listFeaturedProjects } from "@/lib/content";

export default function Home() {
  const projects = listFeaturedProjects();

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
      <SiteFooter />
    </>
  );
}
