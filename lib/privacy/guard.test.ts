import { describe, expect, it } from "vitest";
import {
  assertNoConfidentialDetails,
  assertNoConfidentialDetailsInPublicPdfs,
  collectContentSourceFiles,
  collectPublicPdfFiles,
  runPrivacyGuard,
} from "./guard";
import type { ScannedFile } from "./scan";

const dirtyFiles: ScannedFile[] = [
  { path: "lib/content/example.ts", content: "mentions Secret Codename here" },
];

describe("runPrivacyGuard (fixture denylist and content)", () => {
  it("fails, naming the file and the matching term, when a denylist term is present", () => {
    const result = runPrivacyGuard(["Secret Codename"], dirtyFiles);

    expect(result).toEqual({
      skipped: false,
      hits: [{ file: "lib/content/example.ts", term: "Secret Codename" }],
    });
  });

  it("passes with no hits on a clean run", () => {
    const result = runPrivacyGuard(["Something Unrelated"], dirtyFiles);

    expect(result).toEqual({ skipped: false, hits: [] });
  });

  it("skips with a clear notice when the denylist is absent", () => {
    const result = runPrivacyGuard(null, dirtyFiles);

    expect(result.skipped).toBe(true);
    expect(result.skipped && result.notice).toMatch(/skip/i);
  });
});

describe("assertNoConfidentialDetails", () => {
  it("throws naming the file, but never the raw term (redacted to first letter + length)", () => {
    expect(() =>
      assertNoConfidentialDetails(["Secret Codename"], dirtyFiles),
    ).toThrow(/lib\/content\/example\.ts/);

    try {
      assertNoConfidentialDetails(["Secret Codename"], dirtyFiles);
      throw new Error("expected a throw");
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('"S••••••••••••••"');
      expect(message).not.toContain("Secret Codename");
    }
  });

  it("does not throw on a clean run", () => {
    expect(() =>
      assertNoConfidentialDetails(["Something Unrelated"], dirtyFiles),
    ).not.toThrow();
  });

  it("does not throw when the denylist is absent (skip, not a failure)", () => {
    expect(() =>
      assertNoConfidentialDetails(null, dirtyFiles),
    ).not.toThrow();
  });
});

describe("collectContentSourceFiles", () => {
  it("covers hand-authored copy outside lib/content too (e.g. components/)", () => {
    // Robin's copy isn't confined to lib/content — the Hero's copy, for one, is
    // hardcoded straight into components/hero.tsx. The guard has to see it too.
    const paths = collectContentSourceFiles().map((file) =>
      file.path.replace(/\\/g, "/"),
    );

    expect(paths.some((p) => p.startsWith("lib/content/"))).toBe(true);
    expect(paths.some((p) => p.startsWith("components/"))).toBe(true);
  });
});

describe("public PDFs", () => {
  it("collects the text of PDFs shipped from public/, so the public CV can be scanned", async () => {
    const pdfs = await collectPublicPdfFiles();
    const cv = pdfs.find(
      (file) => file.path.replace(/\\/g, "/") === "public/cv/john-robin-cubi.pdf",
    );

    expect(cv?.content).toContain("Professional Summary");
    // Wrapped lines are joined, so a multi-word term still matches across a line break.
    expect(cv?.content).not.toMatch(/\n/);
  });

  it("fails, naming the PDF, when a denylisted term is inside it", async () => {
    await expect(
      assertNoConfidentialDetailsInPublicPdfs(["Professional Summary"]),
    ).rejects.toThrow(/public\/cv\/john-robin-cubi\.pdf/);
  });

  it("passes when no denylisted term is inside the PDFs, and skips when the denylist is absent", async () => {
    await expect(
      assertNoConfidentialDetailsInPublicPdfs(["Something Unrelated"]),
    ).resolves.toBeUndefined();
    await expect(
      assertNoConfidentialDetailsInPublicPdfs(null),
    ).resolves.toBeUndefined();
  });

  it("finds no Confidential Details in the real public PDFs", async () => {
    // Real, gitignored denylist when present; skips cleanly otherwise.
    await expect(
      assertNoConfidentialDetailsInPublicPdfs(),
    ).resolves.toBeUndefined();
  });
});

describe("privacy guard against the real repo", () => {
  it("finds no Confidential Details in content sources or the built site", () => {
    // Uses the real, gitignored denylist and real repo files when present;
    // skips cleanly when Robin hasn't set up a local denylist yet.
    expect(() => assertNoConfidentialDetails()).not.toThrow();
  });
});
