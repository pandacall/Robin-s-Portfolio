"use client";

import { useRef, useState, type MouseEvent } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavLink = { href: string; label: string };

/**
 * The masthead's four links as a sheet, for widths where they don't fit
 * (the inline nav and this control swap at 640px in globals.css).
 */
export function PhoneNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const pendingHash = useRef<string | null>(null);

  // The sheet locks page scroll while it is open, so a link into the current
  // page waits for the sheet to finish closing before it scrolls. A link from
  // another page (a Case Study) just navigates home and lands on the hash.
  function deferHashScroll(event: MouseEvent<HTMLAnchorElement>) {
    const link = event.currentTarget;
    setOpen(false);
    if (link.pathname === window.location.pathname) {
      event.preventDefault();
      pendingHash.current = link.hash;
    }
  }

  function scrollToPendingHash(isOpen: boolean) {
    if (!isOpen && pendingHash.current) {
      window.location.hash = pendingHash.current;
      pendingHash.current = null;
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen} onOpenChangeComplete={scrollToPendingHash}>
      <SheetTrigger>
        Menu
        <span className="sheet-glyph" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent>
        <div className="sheet-head">
          <SheetTitle>Menu</SheetTitle>
          <SheetClose>Close</SheetClose>
        </div>
        <nav aria-label="Sections">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={deferHashScroll}>
              {link.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
