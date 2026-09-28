import { describe, expect, it } from "vitest";
import { scanForDenylistHits } from "./scan";

describe("scanForDenylistHits", () => {
  it("finds a hit case-insensitively and reports the file and the matching term", () => {
    const hits = scanForDenylistHits(
      ["Internal System X"],
      [
        {
          path: "lib/content/example.ts",
          content: "this quietly uses internal system x under the hood",
        },
      ],
    );

    expect(hits).toEqual([
      { file: "lib/content/example.ts", term: "Internal System X" },
    ]);
  });

  it("passes when no denylist term appears in any file", () => {
    const hits = scanForDenylistHits(
      ["Internal System X"],
      [
        {
          path: "lib/content/example.ts",
          content: "a clean public write-up with no secrets",
        },
      ],
    );

    expect(hits).toEqual([]);
  });

  it("reports one hit per matching file, for every term that matches", () => {
    const hits = scanForDenylistHits(
      ["Alpha Term", "Beta Term"],
      [
        { path: "a.ts", content: "mentions Alpha Term only" },
        { path: "b.ts", content: "mentions Beta Term and Alpha Term both" },
      ],
    );

    expect(hits).toEqual([
      { file: "a.ts", term: "Alpha Term" },
      { file: "b.ts", term: "Alpha Term" },
      { file: "b.ts", term: "Beta Term" },
    ]);
  });

  it("ignores blank denylist entries", () => {
    const hits = scanForDenylistHits(
      ["", "  "],
      [{ path: "a.ts", content: "anything at all" }],
    );

    expect(hits).toEqual([]);
  });
});
