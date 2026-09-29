const TEL_LINK = String.raw`<a\s[^>]*href\s*=\s*["']tel:[^"']*["'][^>]*>[\s\S]*?</a>`;
const SEPARATOR = String.raw`<span\s+class\s*=\s*"separator"\s*>[^<]*</span>`;
const TEL_HREF = /href\s*=\s*["']tel:([^"']*)["']/gi;

// A run of digits joined by the punctuation phone numbers are written with.
const DIGIT_RUN = /\+?\d[\d\s().\-]*\d/g;
const YEAR_GROUP = /^(19|20)\d\d$/;

/**
 * Turns Robin's private CV HTML into the public one: the phone number's link is removed from
 * the contact row, together with one neighbouring separator so no stray "|" is left behind.
 * Throws if any phone number would still be readable in the result.
 */
export function buildPublicCvHtml(sourceHtml: string): string {
  const publicHtml = renderBoldMarkers(
    sourceHtml
      .replace(new RegExp(`${TEL_LINK}\\s*${SEPARATOR}\\s*`, "gi"), "")
      .replace(new RegExp(`${SEPARATOR}\\s*${TEL_LINK}\\s*`, "gi"), "")
      .replace(new RegExp(TEL_LINK, "gi"), ""),
  );

  assertNoPhoneNumber(visibleText(publicHtml), telNumbersIn(sourceHtml));
  if (/tel:/i.test(publicHtml)) {
    throw new Error("A tel: link is still present in the public CV");
  }
  return publicHtml;
}

/** The source's body text carries markdown-style **bold** markers that were never rendered. */
function renderBoldMarkers(html: string): string {
  const bodyStart = html.search(/<body[\s>]/i);
  if (bodyStart === -1) return html;
  return (
    html.slice(0, bodyStart) +
    html.slice(bodyStart).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  );
}

/** The numbers Robin's source publishes as tel: links. */
export function telNumbersIn(html: string): string[] {
  return [...html.matchAll(TEL_HREF)].map((match) => match[1]);
}

/**
 * Throws if `text` contains a phone number: any phone-shaped run of digits (spaced, dashed,
 * dotted, bracketed, with or without a +63 / 0 prefix), or one of the `knownNumbers` written
 * with almost any separators. The error never repeats the number it found.
 */
export function assertNoPhoneNumber(
  text: string,
  knownNumbers: string[] = [],
): void {
  if (looksLikeAPhoneNumber(text) || containsKnownNumber(text, knownNumbers)) {
    throw new Error("A phone number is still present in the public CV text");
  }
}

function looksLikeAPhoneNumber(text: string): boolean {
  return (text.match(DIGIT_RUN) ?? []).some((run) => {
    const groups = run.match(/\d+/g) ?? [];
    if (groups.every((group) => YEAR_GROUP.test(group))) return false;
    const digitCount = groups.join("").length;
    return digitCount >= 10 && digitCount <= 13;
  });
}

function containsKnownNumber(text: string, knownNumbers: string[]): boolean {
  return knownNumbers.some((number) => {
    const digits = number.replace(/\D/g, "").slice(-10);
    if (digits.length < 7) return false;
    const spread = digits.split("").join(String.raw`\D{0,3}`);
    return new RegExp(spread).test(text);
  });
}

/** Text a reader of the rendered CV would see: no styles, scripts, comments or tags. */
function visibleText(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(style|script)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ");
}
