import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfContents {
  pageCount: number;
  text: string;
}

/** Reads a PDF's page count and extracted text (pages joined by newlines). */
export async function readPdf(bytes: Uint8Array): Promise<PdfContents> {
  const task = getDocument({ data: bytes, verbosity: 0 });
  const doc = await task.promise;
  try {
    const pages: string[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : ""))
          .join(""),
      );
    }
    return { pageCount: doc.numPages, text: pages.join("\n") };
  } finally {
    await task.destroy();
  }
}
