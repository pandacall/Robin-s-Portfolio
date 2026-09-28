export function About({ body }: { body: string[] }) {
  return (
    <section className="about" id="about">
      <div className="wrap g">
        <h2>About</h2>
        <div className="text">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
