import { CopyEmail } from "@/components/copy-email";
import { SectionHead } from "@/components/section-head";
import { CV_DOWNLOAD_NAME, CV_URL } from "@/lib/cv/cv-link";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/site/contact";

/**
 * The page's end, in two halves: who Robin is (a small portrait beside the
 * About body) and how to reach Robin (the address, then the actions), so the
 * last thing a Hiring Manager meets is the person and the one action that
 * matters.
 */
export function Contact({ about }: { about: string[] }) {
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <SectionHead
          title="Contact"
          aside={<p className="now">Open to AI Engineer roles, remote or in Metro Manila.</p>}
        />
        <div className="g body">
          <div className="who">
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
          </div>
          <div className="reach">
            <p className="mail">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </p>
            <CopyEmail email={EMAIL} />
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
