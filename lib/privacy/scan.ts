export interface ScannedFile {
  path: string;
  content: string;
}

export interface DenylistHit {
  file: string;
  term: string;
}

export function scanForDenylistHits(
  denylist: string[],
  files: ScannedFile[],
): DenylistHit[] {
  const terms = denylist
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  const hits: DenylistHit[] = [];
  for (const file of files) {
    const haystack = file.content.toLowerCase();
    for (const term of terms) {
      if (haystack.includes(term.toLowerCase())) {
        hits.push({ file: file.path, term });
      }
    }
  }
  return hits;
}
