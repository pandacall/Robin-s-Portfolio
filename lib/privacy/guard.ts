import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { loadDenylist } from "./denylist";
import { scanForDenylistHits, type DenylistHit, type ScannedFile } from "./scan";

const ROOT = process.cwd();
const BUILT_SITE_DIR = path.join(ROOT, "out");

// Human-authored text: source, content data/MDX and docs. Copy lives in lib/content today,
// but also directly in components (e.g. the Hero) and app routes — scan all of it, not just
// lib/content, so a Confidential Detail can't hide in whichever file happens to hold the prose.
const SCANNABLE_EXTENSIONS = /\.(ts|tsx|js|jsx|mdx|md|json|css|html|txt)$/;

function walk(dir: string, isMatch: (filePath: string) => boolean): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath, isMatch);
    return isMatch(fullPath) ? [fullPath] : [];
  });
}

function readAsScannedFiles(filePaths: string[]): ScannedFile[] {
  return filePaths.map((filePath) => ({
    path: path.relative(ROOT, filePath),
    content: readFileSync(filePath, "utf-8"),
  }));
}

/**
 * Every source file that isn't gitignored (tracked, or untracked but not excluded) — i.e.
 * everything that could end up committed to the public repo. This is what actually decides
 * what's public, so it's what the guard trusts instead of a hardcoded list of "content" dirs.
 */
export function collectContentSourceFiles(): ScannedFile[] {
  const output = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: ROOT, encoding: "utf-8" },
  );
  const files = output
    .split("\n")
    .filter((relativePath) => relativePath.length > 0)
    .filter((relativePath) => SCANNABLE_EXTENSIONS.test(relativePath))
    .map((relativePath) => path.join(ROOT, relativePath));
  return readAsScannedFiles(files);
}

/** The statically exported site, when `next build` has already produced `out/`. */
export function collectBuiltHtmlFiles(): ScannedFile[] {
  const files = walk(BUILT_SITE_DIR, (filePath) => filePath.endsWith(".html"));
  return readAsScannedFiles(files);
}

export type PrivacyGuardResult =
  | { skipped: true; notice: string }
  | { skipped: false; hits: DenylistHit[] };

/**
 * Scans content sources and the built site for every term in Robin's denylist.
 * Skips (not a failure) when the gitignored denylist file isn't present locally.
 */
export function runPrivacyGuard(
  denylist: string[] | null = loadDenylist(),
  files: ScannedFile[] = [
    ...collectContentSourceFiles(),
    ...collectBuiltHtmlFiles(),
  ],
): PrivacyGuardResult {
  if (denylist === null) {
    return {
      skipped: true,
      notice:
        "Privacy guard skipped: no .privacy/denylist.txt found locally. " +
        "See CLAUDE.md's privacy section to set one up.",
    };
  }

  return { skipped: false, hits: scanForDenylistHits(denylist, files) };
}

export function assertNoConfidentialDetails(
  denylist?: string[] | null,
  files?: ScannedFile[],
): void {
  const result = runPrivacyGuard(denylist, files);

  if (result.skipped) {
    console.warn(result.notice);
    return;
  }

  if (result.hits.length > 0) {
    const message = result.hits
      .map((hit) => `${hit.file}: contains denylisted term ${redact(hit.term)}`)
      .join("\n");
    throw new Error(`Privacy guard failed:\n${message}`);
  }
}

/**
 * Never surface a raw denylist term in output: this runs via `npm test`, and test output
 * routinely ends up somewhere more persistent than Robin's own terminal (CI logs, a coding
 * agent's tool output/transcript). A redacted hint (first letter + length) is enough to find
 * the term in the local, gitignored denylist file, without ever reproducing it.
 */
function redact(term: string): string {
  if (term.length <= 1) return "•";
  return `"${term[0]}${"•".repeat(term.length - 1)}"`;
}
