import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export interface PdfContents {
  pageCount: number;
  /** [width, height] of the first page, in PDF points. */
  pageSize: [number, number];
  text: string;
}

/** Reads a PDF's page count, page size and extracted text (pages joined by newlines). */
export async function readPdf(bytes: Uint8Array): Promise<PdfContents> {
  const task = getDocument({ data: bytes, verbosity: 0 });
  const doc = await task.promise;
  try {
    const pages: string[] = [];
    let pageSize: [number, number] = [0, 0];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      if (n === 1) {
        const [x0, y0, x1, y1] = page.view;
        pageSize = [x1 - x0, y1 - y0];
      }
      const content = await page.getTextContent();
      pages.push(
        content.items
          .map((item) => ("str" in item ? item.str + (item.hasEOL ? "\n" : "") : ""))
          .join(""),
      );
    }
    return { pageCount: doc.numPages, pageSize, text: pages.join("\n") };
  } finally {
    await task.destroy();
  }
}
