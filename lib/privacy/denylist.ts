import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const DEFAULT_DENYLIST_PATH = path.join(
  process.cwd(),
  ".privacy",
  "denylist.txt",
);

/** Reads Robin's gitignored denylist of Confidential Details. Returns null when absent. */
export function loadDenylist(
  filePath: string = DEFAULT_DENYLIST_PATH,
): string[] | null {
  if (!existsSync(filePath)) return null;

  return readFileSync(filePath, "utf-8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}
