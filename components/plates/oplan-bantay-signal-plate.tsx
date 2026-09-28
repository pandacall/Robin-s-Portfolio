import { PipelinePlate } from "./pipeline-plate";

export function OplanBantaySignalPlate({
  titleId,
  alt,
}: {
  titleId: string;
  alt: string;
}) {
  return (
    <PipelinePlate
      titleId={titleId}
      alt={alt}
      markerId="plate-arrow-1"
      steps={[
        { label: "Measurements" },
        { label: "Six pillars" },
        { label: "Agent draft" },
        { label: "Signed PDF" },
      ]}
      highlightIndex={1}
      subBoxes={["weights · bands · v3.1", "human review"]}
      footer="One run per month · every major provider · results stay with the program"
    />
  );
}
