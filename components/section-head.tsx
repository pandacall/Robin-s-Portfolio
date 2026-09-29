import type { ReactNode } from "react";

/**
 * The head of a supporting section (Stack, Experience, Contact): a heading one
 * tier below a Project title, on an ink rule, with an optional aside at the
 * right. Project titles stay the largest thing on the page after the hero.
 */
export function SectionHead({
  title,
  aside,
}: {
  title: string;
  aside?: ReactNode;
}) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
      {aside && <div className="aside">{aside}</div>}
    </div>
  );
}
