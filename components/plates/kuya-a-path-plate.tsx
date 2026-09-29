import { Arrow, Box, Footer } from "./plate-kit";

/**
 * Plate 2 (home spread): one message's path through Kuya A. In from the two
 * Telegram chats, through deduplication and the gateway, out through the
 * Gatekeeper and the pre-send gate, back to the staff chat, with the
 * principal's chat silent by default. The Case Study keeps the flatter
 * architecture plate (KuyaAPlate).
 */
export function KuyaAPathPlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  return (
    <svg viewBox="0 0 560 348" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>

      <Box x={24} y={40} w={124} h={34} pill label="Principal chat" />
      <Box x={24} y={120} w={124} h={34} pill label="Staff chat" />

      <Arrow i={0} points={[[148, 57], [174, 88]]} />
      <Arrow i={0} points={[[148, 137], [174, 106]]} />
      <Box x={174} y={79} w={90} h={36} label="Dedupe" term="dedupe" />

      <Arrow i={1} points={[[264, 97], [296, 97]]} />
      <Box x={296} y={67} w={120} h={60} label="Agent gateway" term="gateway" hi />

      <Arrow i={2} points={[[416, 90], [448, 44]]} />
      <Arrow i={2} points={[[416, 100], [448, 110]]} />
      <Arrow i={2} points={[[416, 112], [448, 176]]} />
      <Box x={448} y={20} w={112} h={46} label="Workspace" sub="3 identities" term="workspace" />
      <Box x={448} y={88} w={112} h={46} label="Documents" sub="own pipeline" term="documents" />
      <Box x={448} y={156} w={112} h={46} label="Scheduled jobs" sub="every day" term="jobs" />

      <Arrow i={3} points={[[356, 127], [356, 170]]} />
      <Box x={296} y={170} w={120} h={38} label="Gatekeeper" term="gatekeeper" />

      <Arrow i={4} points={[[356, 208], [356, 258]]} />
      <Box x={296} y={258} w={120} h={40} label="Pre-send gate" term="gate" />

      <Arrow i={5} points={[[296, 272], [86, 272], [86, 154]]} />
      <text x="104" y="262" className="p-small">
        reply, once it passes the gate
      </text>

      <g data-term="silent" className="p-node">
        <Arrow i={6} dashed points={[[296, 288], [10, 288], [10, 57], [24, 57]]} />
        <text x="24" y="310" className="p-small">
          principal&rsquo;s chat: silent unless a deliverable is ready
        </text>
      </g>

      <Footer y={344}>Every reply passes the gate · redrawn and simplified</Footer>
    </svg>
  );
}
