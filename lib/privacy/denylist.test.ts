import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadDenylist } from "./denylist";

describe("loadDenylist", () => {
  let dir: string | undefined;

  afterEach(() => {
    if (dir && existsSync(dir)) rmSync(dir, { recursive: true, force: true });
    dir = undefined;
  });

  it("returns null when the denylist file is absent", () => {
    dir = mkdtempSync(path.join(tmpdir(), "privacy-guard-"));
    const missingPath = path.join(dir, "denylist.txt");

    expect(loadDenylist(missingPath)).toBeNull();
  });

  it("reads one term per line, trimming whitespace and skipping blanks and comments", () => {
    dir = mkdtempSync(path.join(tmpdir(), "privacy-guard-"));
    const filePath = path.join(dir, "denylist.txt");
    writeFileSync(
      filePath,
      ["# Officials and colleagues", "  Jane Doe  ", "", "# Internal IDs", "TICKET-1234"].join(
        "\n",
      ),
    );

    expect(loadDenylist(filePath)).toEqual(["Jane Doe", "TICKET-1234"]);
  });
});
