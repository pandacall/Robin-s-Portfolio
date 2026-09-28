import type { Metadata } from "next";
import "@fontsource/familjen-grotesk/latin-400.css";
import "@fontsource/familjen-grotesk/latin-600.css";
import "@fontsource/literata/latin-400.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "John Robin Cubi — Software & AI Engineer",
  description:
    "I build AI agents that run inside the Philippine government.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
