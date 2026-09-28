import { PipelinePlate } from "./pipeline-plate";

export function AyaPlate({ titleId, alt }: { titleId: string; alt: string }) {
  return (
    <PipelinePlate
      titleId={titleId}
      alt={alt}
      markerId="plate-arrow-3"
      steps={[
        { label: "EOD update" },
        { label: "Agent drafts" },
        { label: "Fuzzy match" },
        { label: "Confirmed" },
      ]}
      highlightIndex={1}
      subBoxes={["sheet + tracker", "14 daily jobs"]}
      footer="Behaviour kept as version-controlled files · confirmed before any write"
    />
  );
}
