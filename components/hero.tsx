const HOOK_LINES = [
  "I build AI agents",
  "that run inside",
  "the Philippine",
  "government.",
];

export function Hero() {
  return (
    <section className="hero" id="hero">
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
                <a className="btn" href="/cv/john-robin-cubi.pdf">
                  Download CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
