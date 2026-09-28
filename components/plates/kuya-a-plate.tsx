export function KuyaAPlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  return (
    <svg viewBox="0 0 560 190" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>
      <defs>
        <marker
          id="plate-arrow-2"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0 0 10 5 0 10z" className="p-arrow" />
        </marker>
      </defs>
      <rect x="1" y="18" width="150" height="34" rx="17" className="p-box" />
      <text x="16" y="40" className="p-text">
        Principal chat
      </text>
      <rect x="1" y="70" width="150" height="34" rx="17" className="p-box" />
      <text x="16" y="92" className="p-text">
        Staff chat
      </text>
      <line
        x1="151"
        y1="35"
        x2="190"
        y2="55"
        className="p-line"
        markerEnd="url(#plate-arrow-2)"
      />
      <line
        x1="151"
        y1="87"
        x2="190"
        y2="75"
        className="p-line"
        markerEnd="url(#plate-arrow-2)"
      />
      <rect x="191" y="38" width="140" height="60" rx="2" className="p-box hi" />
      <text x="206" y="72" className="p-text on">
        Agent gateway
      </text>
      <text x="191" y="118" className="p-small">
        + Gatekeeper sub-agent
      </text>
      <line
        x1="331"
        y1="68"
        x2="381"
        y2="30"
        className="p-line"
        markerEnd="url(#plate-arrow-2)"
      />
      <line
        x1="331"
        y1="68"
        x2="381"
        y2="88"
        className="p-line"
        markerEnd="url(#plate-arrow-2)"
      />
      <line
        x1="331"
        y1="68"
        x2="381"
        y2="146"
        className="p-line"
        markerEnd="url(#plate-arrow-2)"
      />
      <rect x="381" y="8" width="178" height="44" rx="2" className="p-box" />
      <text x="394" y="34" className="p-text">
        Google Workspace
      </text>
      <rect x="381" y="66" width="178" height="44" rx="2" className="p-box" />
      <text x="394" y="92" className="p-text">
        Document pipeline
      </text>
      <rect x="381" y="124" width="178" height="44" rx="2" className="p-box" />
      <text x="394" y="150" className="p-text">
        Scheduled jobs
      </text>
      <text x="1" y="184" className="p-small">
        Silent by default in the principal&rsquo;s chat · pre-send gate check
      </text>
    </svg>
  );
}
