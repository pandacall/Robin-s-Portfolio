import { describe, expect, it } from "vitest";
import { assertNoPhoneNumber, buildPublicCvHtml } from "./public-cv";

// Fixture CVs use an obviously fake number: the real one is a Confidential Detail.
function cvWithContactRow(row: string): string {
  return `<html><body><div class="header"><h1>Jane Doe</h1>
<div class="contact-row">${row}</div></div>
<div class="section">Professional Summary</div></body></html>`;
}

const PHONE_LINK = '<a href="tel:+639001234567">+63 900 123 4567</a>';
const SEP = '<span class="separator">|</span>';
const EMAIL_LINK = '<a href="mailto:jane@example.com">jane@example.com</a>';
const LOCATION = "<span>Metro Manila, PH</span>";

describe("buildPublicCvHtml", () => {
  it("drops the phone number from the contact row but keeps the email and the rest", () => {
    const source = cvWithContactRow(
      `${PHONE_LINK}\n${SEP}\n${EMAIL_LINK}\n${SEP}\n${LOCATION}`,
    );

    const publicHtml = buildPublicCvHtml(source);

    expect(publicHtml).not.toMatch(/900|tel:/);
    expect(publicHtml).toContain("jane@example.com");
    expect(publicHtml).toContain("Metro Manila, PH");
    expect(publicHtml).toContain("Professional Summary");
    // No orphaned separator where the phone used to be.
    expect(publicHtml).not.toMatch(/contact-row">\s*<span class="separator"/);
  });

  it("also drops a phone link that comes last in the row, with its leading separator", () => {
    const source = cvWithContactRow([EMAIL_LINK, SEP, PHONE_LINK].join("\n"));

    const publicHtml = buildPublicCvHtml(source);

    expect(publicHtml).toContain("jane@example.com");
    expect(publicHtml).not.toMatch(/900|tel:|separator/);
  });

  it.each([
    ["spaced with +63", "+63 900 123 4567"],
    ["unspaced with +63", "+639001234567"],
    ["spaced without the country code", "0900 123 4567"],
    ["unspaced without the country code", "09001234567"],
    ["ten digits, no leading zero", "9001234567"],
    ["dashed", "900-123-4567"],
    ["dotted with parentheses", "(0900) 123.4567"],
    ["split across lines", ["+63 900", "123 4567"].join("\n")],
  ])("fails when a phone number survives as plain text: %s", (_format, phone) => {
    const source = cvWithContactRow(`${EMAIL_LINK}${SEP}<span>${phone}</span>`);

    expect(() => buildPublicCvHtml(source)).toThrow(/phone number/i);
  });

  it("fails when the number is repeated elsewhere in the CV, outside the tel: link", () => {
    const source = cvWithContactRow(`${PHONE_LINK}${SEP}${EMAIL_LINK}`).replace(
      "Professional Summary",
      "Reachable on 0900 123 4567",
    );

    expect(() => buildPublicCvHtml(source)).toThrow(/phone number/i);
  });

  it("renders markdown-style **bold** markers in the body as bold text", () => {
    const source = cvWithContactRow(EMAIL_LINK).replace(
      "Professional Summary",
      "Built a **tool-calling agent** in **daily use**.",
    );

    const publicHtml = buildPublicCvHtml(source);

    expect(publicHtml).toContain(
      "Built a <strong>tool-calling agent</strong> in <strong>daily use</strong>.",
    );
    expect(publicHtml).not.toContain("**");
  });

  it("does not mistake dates and years for a phone number", () => {
    const source = cvWithContactRow(
      `${EMAIL_LINK}${SEP}<span>Aug 2025 - May 2026, 2024 2025 2026</span>`,
    );

    expect(() => buildPublicCvHtml(source)).not.toThrow();
  });
});

describe("assertNoPhoneNumber", () => {
  it("passes on CV text with an email address, dates and no phone number", () => {
    const text = [
      "Jane Doe",
      "jane@example.com | Metro Manila, PH",
      "Aug 2025 - May 2026",
    ].join("\n");

    expect(() => assertNoPhoneNumber(text)).not.toThrow();
  });

  it("fails on extracted PDF text where the number is broken up by odd separators", () => {
    const text = [
      "Jane Doe",
      "jane@example.com | 900 / 123 / 4567 | Metro Manila",
    ].join("\n");

    expect(() => assertNoPhoneNumber(text, ["+639001234567"])).toThrow(
      /phone number/i,
    );
  });

  it("never repeats the number in its error message", () => {
    try {
      assertNoPhoneNumber("call +63 900 123 4567");
      throw new Error("expected a throw");
    } catch (error) {
      expect((error as Error).message).not.toMatch(/900|4567/);
    }
  });
});
