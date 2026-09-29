/**
 * Builds the public CV PDF from Robin's private CV HTML (cv/cv.html, gitignored):
 * removes the phone number, renders with the locally installed headless Chrome, checks the
 * PDF's own text for any phone number, and writes public/cv/john-robin-cubi.pdf.
 * The source file is only ever read.
 *
 *   npm run build:cv            (set CHROME_PATH if Chrome isn't auto-detected)
 */
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { readPdf } from "../lib/cv/pdf-text";
import {
  assertNoPhoneNumber,
  buildPublicCvHtml,
  telNumbersIn,
} from "../lib/cv/public-cv";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "cv", "cv.html");
const OUTPUT = path.join(ROOT, "public", "cv", "john-robin-cubi.pdf");

// The source's own @page rule sets only the margin; the private PDF is A4, so the public
// one is too (Chrome would otherwise print on Letter).
const PAGE_SIZE_CSS = "<style>@page { size: A4; }</style>";

function findChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    "D:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    process.env.LOCALAPPDATA &&
      path.join(process.env.LOCALAPPDATA, "Google/Chrome/Application/chrome.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  const found = candidates.find((candidate) => candidate && existsSync(candidate));
  if (!found) {
    throw new Error("Chrome not found. Install it or set CHROME_PATH to its executable.");
  }
  return found;
}

async function main(): Promise<void> {
  if (!existsSync(SOURCE)) {
    throw new Error(`Private CV source not found at ${path.relative(ROOT, SOURCE)}`);
  }
  const sourceHtml = readFileSync(SOURCE, "utf-8");
  const publicHtml = buildPublicCvHtml(sourceHtml).replace(
    "</head>",
    `${PAGE_SIZE_CSS}</head>`,
  );

  const workDir = mkdtempSync(path.join(tmpdir(), "public-cv-"));
  try {
    const htmlPath = path.join(workDir, "cv.html");
    const pdfPath = path.join(workDir, "cv.pdf");
    writeFileSync(htmlPath, publicHtml);

    execFileSync(
      findChrome(),
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--user-data-dir=${path.join(workDir, "profile")}`,
        `--print-to-pdf=${pdfPath}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "ignore", timeout: 60_000 },
    );

    const pdfBytes = readFileSync(pdfPath);
    const pdf = await readPdf(new Uint8Array(pdfBytes));
    assertNoPhoneNumber(pdf.text, telNumbersIn(sourceHtml));

    mkdirSync(path.dirname(OUTPUT), { recursive: true });
    writeFileSync(OUTPUT, pdfBytes);
    console.log(
      `Wrote ${path.relative(ROOT, OUTPUT)} (${pdf.pageCount} page, ${pdfBytes.length} bytes)`,
    );
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
