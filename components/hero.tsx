"use client";

import { useEffect, useRef } from "react";
import { DotArchipelago } from "@/components/dot-archipelago";
import { CV_DOWNLOAD_NAME, CV_URL } from "@/lib/cv/cv-link";

const HOOK_LINES = [
  "I build AI agents",
  "that run inside",
  "the Philippine",
  "government.",
];

/**
 * The hero half of the one authored load moment (DESIGN.md "Motion"): the
 * sentence rises line by line, then the lede and actions fade up, once a
 * `ready` class lands on the section root. The archipelago's own scan-in,
 * pulse and pointer behaviour lives entirely inside DotArchipelago; this
 * component doesn't coordinate with it.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => hero.classList.add("ready"));
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="wrap">
        <div className="g">
          <div className="copy">
            <h1 aria-label="I build AI agents that run inside the Philippine government.">
              {HOOK_LINES.map((line) => (
                <span className="ln" aria-hidden="true" key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            <div className="below">
              <p className="lede">
                <b>Software &amp; AI Engineer.</b>{" "}
                <span className="avail">
                  Open to AI Engineer roles — remote or Metro Manila.
                </span>
              </p>
              <div className="acts">
                <a className="btn primary" href="mailto:hello@robincubi.dev">
                  Email
                </a>
                <a className="btn" href={CV_URL} download={CV_DOWNLOAD_NAME}>
                  Download CV
                </a>
              </div>
            </div>
          </div>
          <DotArchipelago variant="hero" />
        </div>
      </div>
    </section>
  );
}
