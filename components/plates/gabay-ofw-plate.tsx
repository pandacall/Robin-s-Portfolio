import { Arrow, Box, Footer } from "./plate-kit";

/**
 * Plate 5: Gabay OFW. One message's path: to the agent, then either the
 * contract check or, when danger comes up, a triage category that code (never
 * the model) resolves to a real contact. The dashed line is where the model's
 * part ends.
 */
export function GabayOfwPlate({ titleId, alt }: { titleId: string; alt: string }) {
  return (
    <svg viewBox="0 0 560 318" role="img" aria-labelledby={titleId}>
      <title id={titleId}>{alt}</title>

      <Box x={0} y={20} w={170} h={46} pill label="Her message" sub="four languages" term="message" />
      <Arrow i={0} points={[[170, 43], [210, 43]]} />
      <Box x={210} y={20} w={130} h={46} label="Gemini agent" hi />

      <Arrow i={1} points={[[340, 43], [380, 43]]} />
      <Box x={380} y={20} w={180} h={46} label="Contract check" sub="standard employment contract" term="contract" />
      <Arrow i={2} points={[[470, 66], [470, 86]]} />
      <Box x={380} y={86} w={180} h={40} label="Findings and a plan" />

      <Arrow i={2} points={[[275, 66], [275, 150]]} />
      <Box x={210} y={150} w={130} h={40} label="Triage category" term="category" />
      <text x="210" y="206" className="p-small">
        the only thing the model emits
      </text>

      <g className="p-node">
        <Arrow i={3} dashed head={false} points={[[360, 140], [360, 290]]} />
        <text x="368" y="143" className="p-small">
          code owns it from here
        </text>
      </g>

      <Arrow i={4} points={[[340, 170], [380, 170]]} />
      <Box x={380} y={150} w={180} h={40} label="Fixed directory" sub="hotlines and MWOs" term="directory" />
      <Arrow i={5} points={[[470, 190], [470, 226]]} />
      <Box x={380} y={226} w={180} h={56} label="Contact card" sub="1343 · OWWA 1348 · her MWO" />

      <Arrow i={2} points={[[228, 66], [228, 112], [85, 112], [85, 150]]} />
      <Box x={0} y={150} w={170} h={56} label="Her Case" sub="every fact has a source" />
      <Arrow i={3} points={[[85, 206], [85, 226]]} />
      <Box x={0} y={226} w={170} h={44} label="Per-user rules" sub="tested on the emulator" term="rules" />

      <Footer y={314}>The model never writes a phone number · redrawn from the code</Footer>
    </svg>
  );
}
