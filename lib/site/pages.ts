import { listCaseStudyProjects } from "../content";

export const SITE_NAME = "John Robin Cubi";
export const SITE_URL = "https://robincubi.dev";

export const HOME_HEADLINE = "Software & AI Engineer";
export const HOME_HOOK = "I build AI agents that run inside the Philippine government.";

const HOME_TITLE = `${SITE_NAME} — ${HOME_HEADLINE}`;
const HOME_DESCRIPTION = `${HOME_HOOK} ${SITE_NAME} is a Software & AI Engineer, open to AI Engineer roles, remote or Metro Manila.`;

/** A prerendered page and the metadata that names it in search results and link previews. */
export interface SitePage {
  /** Route path, starting with "/". */
  path: string;
  title: string;
  description: string;
  /** The Project a Case Study page is about; undefined on the home page. */
  projectName?: string;
}

/** A Case Study's lede is two or three sentences; a preview only has room for the first. */
function firstSentence(text: string): string {
  const end = text.indexOf(". ");
  return end === -1 ? text : text.slice(0, end + 1);
}

/** Every prerendered page, home first: the sitemap, the metadata and the share images all read this list. */
export function listPages(): SitePage[] {
  return [
    { path: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
    ...listCaseStudyProjects().map((project) => ({
      path: `/work/${project.caseStudySlug}`,
      title: `${project.name}: Case Study — ${SITE_NAME}`,
      description: firstSentence(project.caseStudy.lede),
      projectName: project.name,
    })),
  ];
}

export function getPage(path: string): SitePage {
  const page = listPages().find((candidate) => candidate.path === path);
  if (!page) throw new Error(`No prerendered page at "${path}"`);
  return page;
}

/** The page's public URL. The home page has no trailing slash, matching the canonical tag Next emits. */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
