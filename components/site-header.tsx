import Link from "next/link";
import { PhoneNav, type NavLink } from "@/components/phone-nav";

// Root-relative so the links also work from a Case Study page: there they
// navigate home and land on the section.
const links: NavLink[] = [
  { href: "/#work", label: "Work" },
  { href: "/#stack", label: "Stack" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

/**
 * `skipTo` is the id of where the page's own content starts, so the first Tab
 * stop can hop over the masthead links.
 */
export function SiteHeader({ skipTo = "main-content" }: { skipTo?: string }) {
  return (
    <>
      <a className="skip" href={`#${skipTo}`}>
        Skip to content
      </a>
      <header className="top">
        <div className="wrap">
          <Link className="brand" href="/">
            John Robin Cubi
          </Link>
          <nav className="inline" aria-label="Sections">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <PhoneNav links={links} />
        </div>
      </header>
    </>
  );
}
