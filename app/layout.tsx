import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "@fontsource/familjen-grotesk/latin-400.css";
import "@fontsource/familjen-grotesk/latin-600.css";
import "@fontsource/literata/latin-400.css";
import "./globals.css";
import { siteMetadata } from "@/lib/site/metadata";
import { getPage } from "@/lib/site/pages";

const home = getPage("/");

export const metadata: Metadata = {
  ...siteMetadata,
  title: home.title,
  description: home.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Marks the document as scripted before first paint, so the hero's and
          the archipelago's hidden start states (the load moment) only apply
          when the script that reveals them will actually run.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body>
        {children}
        {/*
          Vercel Web Analytics: page views only. It sets no cookies, so the site
          needs no consent banner. Custom events (Email, Download CV, demo use)
          are not sent: Vercel supports them only on paid plans, and the plan
          isn't known. Add track() calls here if the project is on Pro.
        */}
        <Analytics />
      </body>
    </html>
  );
}
