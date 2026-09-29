import { CV_DOWNLOAD_NAME, CV_URL } from "@/lib/cv/cv-link";

const EMAIL = "hello@robincubi.dev";
const LINKEDIN_URL = "https://www.linkedin.com/in/john-robin-cubi/";
const GITHUB_URL = "https://github.com/pandacall";

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="wrap g">
        <div className="lead">
          <h2>Contact</h2>
          <p className="mail">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </div>
        <p className="side">
          One email is enough. Open to remote work across time zones, or in
          person in Metro Manila.
        </p>
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
    </section>
  );
}
