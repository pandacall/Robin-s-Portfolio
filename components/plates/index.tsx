import type { ReactElement } from "react";
import { AyaPlate } from "./aya-plate";
import { GabayOfwPlate } from "./gabay-ofw-plate";
import { KuyaAPathPlate } from "./kuya-a-path-plate";
import { OplanBantaySignalPlate } from "./oplan-bantay-signal-plate";
import { OplanTindigPlate } from "./oplan-tindig-plate";

export const PLATES: Record<
  string,
  (props: { titleId: string; alt: string }) => ReactElement
> = {
  "oplan-bantay-signal": OplanBantaySignalPlate,
  "kuya-a": KuyaAPathPlate,
  aya: AyaPlate,
  "oplan-tindig": OplanTindigPlate,
  "gabay-ofw": GabayOfwPlate,
};
