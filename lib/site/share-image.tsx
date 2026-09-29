import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  ARCHIPELAGO_COLS,
  ARCHIPELAGO_DOTS,
  ARCHIPELAGO_ROWS,
  CELL,
} from "../dot-archipelago-data";
import { SITE_NAME, getPage } from "./pages";

export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

// DESIGN.md light values: a share preview is always the light, canonical look.
const COLOR = {
  capiz: "#FBFAF6",
  concrete: "#D9D6CF",
  ink: "#1E1C19",
  ink2: "#5C5750",
  rule: "#C4BFB2",
  narra: "#6B3F24",
  green: "#1F3A2E",
  green2: "#4F7A63",
};

const HOME_HEADLINE = "Software & AI Engineer";
const HOME_LEDE = "I build AI agents that run inside the Philippine government.";
const CASE_STUDY_META = "Work · Private, demo on request · Case Study";
const DOMAIN = "robincubi.dev";

const MAP_HEIGHT = 520;
const MAP_WIDTH = Math.round((MAP_HEIGHT * ARCHIPELAGO_COLS) / ARCHIPELAGO_ROWS);

// Satori reads WOFF but not WOFF2, so load the .woff files the fonts ship beside their CSS.
function readFont(family: string, file: string): Promise<Buffer> {
  return readFile(
    path.join(process.cwd(), "node_modules", "@fontsource", family, "files", file),
  );
}

const fonts = Promise.all([
  readFont("familjen-grotesk", "familjen-grotesk-latin-600-normal.woff"),
  readFont("literata", "literata-latin-400-normal.woff"),
]);

/** The dot archipelago as an SVG data URI, in the site's greens (weight is illustrative, as on the site). */
function archipelagoSrc(): string {
  const fill = [
    `fill="${COLOR.green2}" fill-opacity="0.55"`,
    `fill="${COLOR.green}" fill-opacity="0.8"`,
    `fill="${COLOR.green}"`,
  ];
  const dots = ARCHIPELAGO_DOTS.map(
    ([x, y, weight]) =>
      `<circle cx="${x * CELL + CELL / 2}" cy="${y * CELL + CELL / 2}" r="3.1" ${fill[weight]}/>`,
  ).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ARCHIPELAGO_COLS * CELL} ${ARCHIPELAGO_ROWS * CELL}">${dots}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/**
 * The 1200x630 share image for a page, in the Tropical Modernist system: capiz ground,
 * a concrete field holding the dot archipelago, Familjen Grotesk headline, Literata lede.
 * It draws only the page's own title text, so no Confidential Detail can reach it.
 */
export async function renderShareImage(pagePath: string): Promise<ImageResponse> {
  const page = getPage(pagePath);
  const [grotesk, literata] = await fonts;
  const headline = page.projectName ?? HOME_HEADLINE;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: COLOR.capiz,
          color: COLOR.ink,
          fontFamily: "Familjen Grotesk",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 760,
            padding: "64px 72px 56px 72px",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, letterSpacing: "-0.01em" }}>
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: page.projectName ? 104 : 96,
                lineHeight: 0.96,
                letterSpacing: "-0.035em",
              }}
            >
              {headline}
            </div>
            {page.projectName ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: 36,
                  fontSize: 26,
                  color: COLOR.ink2,
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    background: COLOR.narra,
                    marginRight: 14,
                  }}
                />
                {CASE_STUDY_META}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  marginTop: 36,
                  fontFamily: "Literata",
                  fontSize: 32,
                  lineHeight: 1.4,
                  color: COLOR.ink2,
                }}
              >
                {HOME_LEDE}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              paddingTop: 20,
              borderTop: `1px solid ${COLOR.rule}`,
              fontSize: 24,
              color: COLOR.ink2,
            }}
          >
            {DOMAIN}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            background: COLOR.concrete,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- satori draws this inside ImageResponse; next/image doesn't apply */}
          <img
            src={archipelagoSrc()}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            alt=""
          />
        </div>
      </div>
    ),
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [
        { name: "Familjen Grotesk", data: grotesk, weight: 600, style: "normal" },
        { name: "Literata", data: literata, weight: 400, style: "normal" },
      ],
    },
  );
}
