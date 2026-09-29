import { CopyEmail } from "@/components/copy-email";
import { ManilaTime } from "@/components/manila-time";
import { SectionHead } from "@/components/section-head";
import { CV_DOWNLOAD_NAME, CV_URL } from "@/lib/cv/cv-link";

const EMAIL = "hello@robincubi.dev";
const LINKEDIN_URL = "https://www.linkedin.com/in/john-robin-cubi/";
const GITHUB_URL = "https://github.com/pandacall";

/**
 * The page's end: who Robin is (the About body, beside a portrait) and how to
 * reach Robin, in one room, so the last thing a Hiring Manager meets is the
 * person and the one action that matters.
 */
export function Contact({ about }: { about: string[] }) {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <SectionHead
          title="Contact"
          aside={
            <p className="now">
              <ManilaTime />
              <span>Open to AI Engineer roles, remote or in Metro Manila</span>
            </p>
          }
        />
        <div className="g body">
          <figure className="portrait">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, no image optimiser */}
            <img
              src="/images/john-robin-cubi.webp"
              alt="John Robin Cubi, in a barong, facing the camera."
              width={720}
              height={900}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div className="about" id="about">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="reach">
            <p className="mail">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <div className="mail-meta">
              <CopyEmail email={EMAIL} />
              <span className="side">One email is enough.</span>
            </div>
            <div className="acts">
              <a className="btn primary" href={`mailto:${EMAIL}`}>
                Email
              </a>
              <a className="btn" href={CV_URL} download={CV_DOWNLOAD_NAME}>
                Download CV
              </a>
              <a className="btn" href={LINKEDIN_URL}>
                LinkedIn
              </a>
              <a className="btn" href={GITHUB_URL}>
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
