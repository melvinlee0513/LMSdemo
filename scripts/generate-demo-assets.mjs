#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * Demo asset generator
 * ---------------------------------------------------------------------------
 * Renders the fictional demo centre's illustrations from vector sources to
 * optimised .webp files, plus the SVG logo/favicon and the PNG app icon.
 *
 *   npm run generate-assets
 *
 * Why generate rather than commit binaries blindly: every asset has a known
 * intrinsic size that matches the dimensions declared in the centre data, so
 * next/image can reserve space and nothing shifts on load.
 *
 * A real centre supplies its own photography and illustrations. This script
 * exists so the reference centre ships something honest — clearly illustrated,
 * never a stock photo of a real person presented as a tutor.
 *
 * Naming convention: one semantic object, one semantic file.
 *   physics-atom.webp        not  IMG_9273.webp
 *   tutor-chen-wei-lun.webp  not  img4.webp
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/centres/demo-centre");

const BRAND = "#ef4524";
const BRAND_2 = "#ff7a1f";
const INK = "#202632";
const SOFT = "#fff0ed";
const SOFT_2 = "#fff8f5";

/* -------------------------------------------------------------------------- */
/* helpers                                                                     */
/* -------------------------------------------------------------------------- */

const svg = (width, height, body, background = "none") => `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <rect width="${width}" height="${height}" fill="${background}"/>
  ${body}
</svg>`;

async function writeWebp(relativePath, markup, { quality = 86 } = {}) {
  const target = join(outDir, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await sharp(Buffer.from(markup)).webp({ quality, effort: 6 }).toFile(target);
  console.log(`  ✓ ${relativePath}`);
}

async function writeText(relativePath, contents) {
  const target = join(outDir, relativePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, contents, "utf8");
  console.log(`  ✓ ${relativePath}`);
}

/* -------------------------------------------------------------------------- */
/* branding                                                                    */
/* -------------------------------------------------------------------------- */

/** A geometric "G" mark: an open ring with an inner bar, on a gradient tile. */
const logoMark = (size = 40, radius = 12) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
      <stop stop-color="${BRAND}"/>
      <stop offset="1" stop-color="${BRAND_2}"/>
    </linearGradient>
  </defs>
  <rect width="40" height="40" rx="${radius}" fill="url(#g)"/>
  <path d="M27.5 15.2A8.6 8.6 0 1 0 28 24.6h-6.6" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

/* -------------------------------------------------------------------------- */
/* subject illustrations — 960 × 720                                           */
/* -------------------------------------------------------------------------- */

const W = 960;
const H = 720;

const softBlob = (cx, cy, r, fill = SOFT, opacity = 1) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" opacity="${opacity}"/>`;

const subjectIllustrations = {
  "additional-mathematics-graph": (accent = "#3f6fd8") =>
    svg(
      W,
      H,
      `
      ${softBlob(480, 360, 300, "#eef2fd")}
      <g stroke="#d7dff5" stroke-width="3">
        ${Array.from({ length: 7 }, (_, i) => `<line x1="${240 + i * 80}" y1="140" x2="${240 + i * 80}" y2="580"/>`).join("")}
        ${Array.from({ length: 6 }, (_, i) => `<line x1="240" y1="${140 + i * 88}" x2="720" y2="${140 + i * 88}"/>`).join("")}
      </g>
      <line x1="240" y1="580" x2="740" y2="580" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <line x1="240" y1="580" x2="240" y2="120" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
      <path d="M270 540 Q 480 60 700 480" stroke="${accent}" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M270 200 Q 470 520 700 260" stroke="${BRAND}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.85"/>
      <circle cx="480" cy="285" r="18" fill="#fff" stroke="${accent}" stroke-width="9"/>
      <circle cx="700" cy="480" r="14" fill="${accent}"/>
      <circle cx="270" cy="200" r="14" fill="${BRAND}"/>
      <rect x="612" y="120" width="150" height="66" rx="20" fill="#fff" stroke="#dfe4f2" stroke-width="4"/>
      <path d="M642 153h44M664 131v44" stroke="${accent}" stroke-width="9" stroke-linecap="round"/>
      <path d="M712 143l26 20M738 143l-26 20" stroke="${BRAND}" stroke-width="9" stroke-linecap="round"/>
    `,
    ),

  "physics-atom": (accent = "#6b4fd8") =>
    svg(
      W,
      H,
      `
      ${softBlob(480, 360, 296, "#f1eefc")}
      <g stroke="${accent}" stroke-width="11" fill="none" opacity="0.9">
        <ellipse cx="480" cy="360" rx="270" ry="108"/>
        <ellipse cx="480" cy="360" rx="270" ry="108" transform="rotate(60 480 360)"/>
        <ellipse cx="480" cy="360" rx="270" ry="108" transform="rotate(120 480 360)"/>
      </g>
      <circle cx="480" cy="360" r="58" fill="${BRAND}"/>
      <circle cx="480" cy="360" r="58" fill="url(#none)"/>
      <circle cx="750" cy="360" r="26" fill="${accent}"/>
      <circle cx="345" cy="126" r="22" fill="${BRAND_2}"/>
      <circle cx="345" cy="594" r="22" fill="${accent}" opacity="0.7"/>
      <circle cx="480" cy="360" r="24" fill="#fff" opacity="0.45"/>
    `,
    ),

  "chemistry-flask": (accent = "#1f9d76") =>
    svg(
      W,
      H,
      `
      ${softBlob(480, 372, 292, "#e9f7f2")}
      <path d="M412 150h136v150l150 258a56 56 0 0 1-48 86H310a56 56 0 0 1-48-86l150-258V150Z"
            fill="#fff" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M330 470h300l88 152a34 34 0 0 1-29 52H271a34 34 0 0 1-29-52l88-152Z" fill="${accent}" opacity="0.85"/>
      <rect x="396" y="120" width="168" height="42" rx="21" fill="${INK}"/>
      <circle cx="430" cy="560" r="20" fill="#fff" opacity="0.75"/>
      <circle cx="500" cy="606" r="13" fill="#fff" opacity="0.6"/>
      <circle cx="556" cy="548" r="16" fill="#fff" opacity="0.65"/>
      <circle cx="690" cy="220" r="18" fill="${BRAND_2}"/>
      <circle cx="742" cy="286" r="11" fill="${BRAND}"/>
      <circle cx="656" cy="300" r="8" fill="${accent}"/>
    `,
    ),

  "english-open-book": (accent = "#d8843f") =>
    svg(
      W,
      H,
      `
      ${softBlob(480, 372, 292, "#fdf2e6")}
      <path d="M480 252c-58-44-146-62-232-52-16 2-28 15-28 31v274c0 18 15 32 33 30 80-8 160 8 227 47V252Z"
            fill="#fff" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <path d="M480 252c58-44 146-62 232-52 16 2 28 15 28 31v274c0 18-15 32-33 30-80-8-160 8-227 47V252Z"
            fill="#fff" stroke="${INK}" stroke-width="12" stroke-linejoin="round"/>
      <g stroke="${accent}" stroke-width="11" stroke-linecap="round" opacity="0.75">
        <line x1="286" y1="300" x2="422" y2="310"/>
        <line x1="286" y1="356" x2="422" y2="366"/>
        <line x1="286" y1="412" x2="386" y2="420"/>
        <line x1="538" y1="310" x2="674" y2="300"/>
        <line x1="538" y1="366" x2="674" y2="356"/>
        <line x1="538" y1="422" x2="638" y2="414"/>
      </g>
      <path d="M480 252v330" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>
      <path d="M700 150l16 40 40 16-40 16-16 40-16-40-40-16 40-16 16-40Z" fill="${BRAND}"/>
      <path d="M256 168l10 26 26 10-26 10-10 26-10-26-26-10 26-10 10-26Z" fill="${BRAND_2}"/>
    `,
    ),

  "sejarah-scroll": (accent = "#a2603a") =>
    svg(
      W,
      H,
      `
      ${softBlob(480, 372, 292, "#f7efe8")}
      <rect x="640" y="196" width="112" height="356" rx="14" fill="#fff" stroke="${INK}" stroke-width="12"/>
      <g stroke="${accent}" stroke-width="10" stroke-linecap="round" opacity="0.5">
        <line x1="672" y1="240" x2="672" y2="508"/>
        <line x1="720" y1="240" x2="720" y2="508"/>
      </g>
      <rect x="620" y="160" width="152" height="42" rx="21" fill="${INK}"/>
      <rect x="620" y="546" width="152" height="42" rx="21" fill="${INK}"/>
      <path d="M232 214h300a40 40 0 0 1 40 40v240a40 40 0 0 1-40 40H232a40 40 0 0 1-40-40V254a40 40 0 0 1 40-40Z"
            fill="#fff" stroke="${INK}" stroke-width="12"/>
      <g stroke="${accent}" stroke-width="11" stroke-linecap="round" opacity="0.8">
        <line x1="240" y1="286" x2="500" y2="286"/>
        <line x1="240" y1="344" x2="500" y2="344"/>
        <line x1="240" y1="402" x2="440" y2="402"/>
        <line x1="240" y1="460" x2="470" y2="460"/>
      </g>
      <circle cx="192" cy="214" r="30" fill="${BRAND}"/>
      <circle cx="192" cy="534" r="30" fill="${BRAND_2}"/>
      <circle cx="572" cy="214" r="30" fill="${BRAND_2}"/>
      <circle cx="572" cy="534" r="30" fill="${BRAND}"/>
    `,
    ),
};

/* -------------------------------------------------------------------------- */
/* people — abstract illustrated portraits (never fake photography)            */
/* -------------------------------------------------------------------------- */

const PORTRAIT_PALETTES = [
  { bg: "#fff1ec", skin: "#e0a781", hair: "#2f2a33", clothes: "#3f6fd8", accent: BRAND },
  { bg: "#eef3fd", skin: "#efc49c", hair: "#1f1b22", clothes: "#1f9d76", accent: BRAND_2 },
  { bg: "#f3eefc", skin: "#c98f68", hair: "#241c1a", clothes: "#ef4524", accent: "#6b4fd8" },
  { bg: "#eaf7f1", skin: "#9c6a45", hair: "#191418", clothes: "#d8843f", accent: "#1f9d76" },
  { bg: "#fdf3e7", skin: "#d9a077", hair: "#332a2a", clothes: "#6b4fd8", accent: BRAND },
];

/**
 * Head-and-shoulders illustration.
 *
 * Flat, faceless and unmistakably drawn — a demo centre must not present a
 * stock photograph of a real person as one of its tutors. `style` varies the
 * silhouette so the team does not look like five copies of one drawing.
 *
 * Hair is clipped to the skull for the short styles and drawn behind the head
 * for the long ones, which is what stops it reading as a helmet.
 */
const portrait = (width, height, palette, style = 0, seed = 0) => {
  const cx = width / 2;
  const r = width * 0.17;
  const headY = height * 0.365;
  const { bg, skin, hair, clothes, accent } = palette;
  const id = `p${seed}`;

  const shoulderTop = height * 0.66;
  const shoulders = `M${cx - width * 0.33} ${height} v-${height * 0.1}
     a${width * 0.33} ${(height - shoulderTop) * 0.95} 0 0 1 ${width * 0.66} 0 v${height * 0.1} Z`;

  /* Behind-the-head hair (long styles, buns, headscarves). */
  const backLayer = [
    "",
    `<path d="M${cx - r * 1.16} ${headY - r * 0.2} a${r * 1.16} ${r * 1.16} 0 0 1 ${r * 2.32} 0
              v${r * 1.7} q0 ${r * 0.35} -${r * 0.34} ${r * 0.35} h-${r * 1.64}
              q-${r * 0.34} 0 -${r * 0.34} -${r * 0.35} Z" fill="${hair}"/>`,
    `<circle cx="${cx}" cy="${headY - r * 1.12}" r="${r * 0.44}" fill="${hair}"/>`,
    `<path d="M${cx - r * 1.22} ${headY} a${r * 1.22} ${r * 1.22} 0 0 1 ${r * 2.44} 0
              v${r * 2.1} q0 ${r * 0.4} -${r * 0.4} ${r * 0.4} h-${r * 1.64}
              q-${r * 0.4} 0 -${r * 0.4} -${r * 0.4} Z" fill="${hair}"/>`,
    "",
  ][style % 5];

  /* Hair sitting on the skull, clipped so it follows the head shape. */
  const capLayer = [
    `<rect x="${cx - r}" y="${headY - r}" width="${r * 2}" height="${r * 0.92}" fill="${hair}"/>
     <path d="M${cx - r} ${headY - r * 0.08} q${r * 0.55} ${r * 0.42} ${r * 1.05} -${r * 0.1}
              q${r * 0.5} -${r * 0.3} ${r * 0.95} ${r * 0.06} v-${r * 0.6} h-${r * 2} Z" fill="${hair}"/>`,
    `<path d="M${cx - r} ${headY - r} h${r * 2} v${r * 0.5} q-${r} ${r * 0.42} -${r * 2} 0 Z" fill="${hair}"/>`,
    `<path d="M${cx - r} ${headY - r} h${r * 2} v${r * 0.44} q-${r * 0.6} ${r * 0.5} -${r * 1.35} ${r * 0.06}
              q-${r * 0.35} -${r * 0.16} -${r * 0.65} ${r * 0.04} Z" fill="${hair}"/>`,
    `<path d="M${cx - r} ${headY - r} h${r * 2} v${r * 0.56} q-${r} ${r * 0.46} -${r * 2} 0 Z" fill="${hair}"/>`,
    "",
  ][style % 5];

  /* A headscarf is drawn as one continuous shape rather than as hair. */
  const scarf =
    style % 5 === 4
      ? `<path d="M${cx - r * 1.3} ${headY + r * 0.5}
            a${r * 1.3} ${r * 1.35} 0 0 1 ${r * 2.6} 0
            q0 ${r * 1.5} -${r * 0.5} ${r * 2.2}
            h-${r * 1.6} q-${r * 0.5} -${r * 0.7} -${r * 0.5} -${r * 2.2} Z"
            fill="${palette.accent}" opacity="0.92"/>
         <path d="M${cx - r * 0.86} ${headY - r * 0.5}
            a${r * 0.9} ${r * 0.86} 0 0 1 ${r * 1.72} 0
            q-${r * 0.86} -${r * 0.36} -${r * 1.72} 0 Z" fill="#000" opacity="0.08"/>`
      : "";

  return svg(
    width,
    height,
    `
    <defs>
      <clipPath id="${id}head"><circle cx="${cx}" cy="${headY}" r="${r}"/></clipPath>
      <linearGradient id="${id}bg" x1="0" y1="0" x2="0" y2="${height}" gradientUnits="userSpaceOnUse">
        <stop stop-color="#ffffff" stop-opacity="0.75"/>
        <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <circle cx="${cx}" cy="${height * 0.33}" r="${width * 0.36}" fill="url(#${id}bg)"/>

    ${backLayer}

    <!-- neck, tucked behind the shoulders -->
    <path d="M${cx - r * 0.4} ${headY + r * 0.45} h${r * 0.8} v${r * 1.1} h-${r * 0.8} Z" fill="${skin}"/>
    <path d="M${cx - r * 0.4} ${headY + r * 0.9} q${r * 0.4} ${r * 0.35} ${r * 0.8} 0 v${r * 0.7} h-${r * 0.8} Z" fill="#000" opacity="0.07"/>

    <!-- shoulders -->
    <path d="${shoulders}" fill="${clothes}"/>
    <path d="M${cx - r * 0.5} ${shoulderTop + r * 0.02} l${r * 0.5} ${r * 0.6} l${r * 0.5} -${r * 0.6}
             q-${r * 0.5} -${r * 0.24} -${r} 0 Z" fill="#fff" opacity="0.5"/>

    <!-- ears + head -->
    <circle cx="${cx - r * 0.98}" cy="${headY + r * 0.12}" r="${r * 0.19}" fill="${skin}"/>
    <circle cx="${cx + r * 0.98}" cy="${headY + r * 0.12}" r="${r * 0.19}" fill="${skin}"/>
    <circle cx="${cx}" cy="${headY}" r="${r}" fill="${skin}"/>
    <g clip-path="url(#${id}head)">${capLayer}</g>
    ${scarf}

    <!-- small brand accent so the set feels part of one system -->
    <circle cx="${cx + width * 0.13}" cy="${shoulderTop + height * 0.14}" r="${width * 0.035}" fill="${accent}" opacity="0.85"/>
  `,
    bg,
  );
};

/* -------------------------------------------------------------------------- */
/* scenes                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The composition is deliberately weighted to the upper two thirds: the hero's
 * lesson-preview panel sits over the bottom of this image, so nothing
 * important is allowed to live down there.
 */
const classroomScene = (width, height, variant = 0) => {
  const deskY = height * 0.58;

  return svg(
    width,
    height,
    `
    <rect width="${width}" height="${height}" fill="${variant === 0 ? "#fff6f2" : "#f5f7fb"}"/>
    <circle cx="${width * 0.82}" cy="${height * 0.16}" r="${width * 0.14}" fill="${SOFT}"/>

    <!-- whiteboard -->
    <rect x="${width * 0.12}" y="${height * 0.06}" width="${width * 0.56}" height="${height * 0.28}" rx="18" fill="#fff" stroke="#dfe3ec" stroke-width="6"/>
    <g stroke="${BRAND}" stroke-width="8" stroke-linecap="round" opacity="0.8">
      <line x1="${width * 0.17}" y1="${height * 0.13}" x2="${width * 0.42}" y2="${height * 0.13}"/>
      <line x1="${width * 0.17}" y1="${height * 0.18}" x2="${width * 0.5}" y2="${height * 0.18}"/>
    </g>
    <g stroke="#9aa4b8" stroke-width="7" stroke-linecap="round">
      <line x1="${width * 0.17}" y1="${height * 0.24}" x2="${width * 0.36}" y2="${height * 0.24}"/>
      <line x1="${width * 0.17}" y1="${height * 0.29}" x2="${width * 0.46}" y2="${height * 0.29}"/>
    </g>
    <path d="M${width * 0.52} ${height * 0.24} l${width * 0.05} ${height * 0.05} l${width * 0.09} -${height * 0.11}"
          stroke="#1f9d76" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>

    <!-- seated students -->
    ${[0.24, 0.44, 0.64]
      .map((x, index) => {
        const cx = width * x;
        const skin = ["#e8b48f", "#c98f68", "#f0c9a5"][index] ?? "#e8b48f";
        const clothes = [BRAND, "#3f6fd8", "#1f9d76"][index] ?? BRAND;
        return `
          <path d="M${cx - width * 0.07} ${deskY} q0 -${height * 0.13} ${width * 0.07} -${height * 0.13} q${width * 0.07} 0 ${width * 0.07} ${height * 0.13} Z" fill="${clothes}"/>
          <circle cx="${cx}" cy="${deskY - height * 0.16}" r="${width * 0.042}" fill="${skin}"/>
          <path d="M${cx - width * 0.047} ${deskY - height * 0.163} a${width * 0.047} ${width * 0.05} 0 0 1 ${width * 0.094} 0 Z" fill="#2f2a33"/>
        `;
      })
      .join("")}

    <!-- desk -->
    <rect x="${width * 0.1}" y="${deskY}" width="${width * 0.72}" height="${height * 0.05}" rx="14" fill="${INK}"/>
    <rect x="${width * 0.16}" y="${deskY + height * 0.05}" width="${width * 0.03}" height="${height * 0.13}" fill="${INK}" opacity="0.75"/>
    <rect x="${width * 0.7}" y="${deskY + height * 0.05}" width="${width * 0.03}" height="${height * 0.13}" fill="${INK}" opacity="0.75"/>

    <!-- books + plant -->
    <rect x="${width * 0.2}" y="${deskY - height * 0.032}" width="${width * 0.12}" height="${height * 0.032}" rx="6" fill="${BRAND_2}"/>
    <rect x="${width * 0.23}" y="${deskY - height * 0.056}" width="${width * 0.12}" height="${height * 0.024}" rx="6" fill="#3f6fd8"/>
    <rect x="${width * 0.85}" y="${deskY - height * 0.08}" width="${width * 0.075}" height="${height * 0.08}" rx="10" fill="#e8ded6"/>
    <path d="M${width * 0.887} ${deskY - height * 0.08} q-${width * 0.045} -${height * 0.08} ${width * 0.005} -${height * 0.14}
             q${width * 0.045} ${height * 0.06} -${width * 0.005} ${height * 0.14} Z" fill="#1f9d76"/>
  `,
  );
};

const branchScene = (width, height, tone = 0) =>
  svg(
    width,
    height,
    `
    <rect width="${width}" height="${height}" fill="${tone === 0 ? "#fdf4ef" : "#eef3f7"}"/>
    <circle cx="${width * 0.16}" cy="${height * 0.2}" r="${width * 0.1}" fill="#fff" opacity="0.7"/>

    <rect x="${width * 0.12}" y="${height * 0.2}" width="${width * 0.76}" height="${height * 0.66}" rx="20" fill="#fff" stroke="#dfe3ec" stroke-width="6"/>
    <rect x="${width * 0.12}" y="${height * 0.2}" width="${width * 0.76}" height="${height * 0.12}" rx="20" fill="${INK}"/>
    <rect x="${width * 0.2}" y="${height * 0.245}" width="${width * 0.3}" height="${height * 0.032}" rx="16" fill="#fff" opacity="0.85"/>

    <!-- awning -->
    <path d="M${width * 0.12} ${height * 0.34} h${width * 0.76} l-${width * 0.04} ${height * 0.08} h-${width * 0.68} Z" fill="${BRAND}"/>
    ${Array.from({ length: 6 }, (_, i) => {
      const x = width * (0.16 + i * 0.12);
      return `<rect x="${x}" y="${height * 0.34}" width="${width * 0.06}" height="${height * 0.08}" fill="#fff" opacity="0.28"/>`;
    }).join("")}

    <!-- windows and door -->
    <rect x="${width * 0.17}" y="${height * 0.48}" width="${width * 0.22}" height="${height * 0.24}" rx="12" fill="${SOFT_2}" stroke="#dfe3ec" stroke-width="5"/>
    <rect x="${width * 0.43}" y="${height * 0.48}" width="${width * 0.22}" height="${height * 0.24}" rx="12" fill="${SOFT_2}" stroke="#dfe3ec" stroke-width="5"/>
    <rect x="${width * 0.7}" y="${height * 0.46}" width="${width * 0.13}" height="${height * 0.4}" rx="12" fill="#e9edf4" stroke="#dfe3ec" stroke-width="5"/>
    <circle cx="${width * 0.795}" cy="${height * 0.66}" r="${width * 0.008}" fill="${INK}"/>

    <!-- pavement + planter -->
    <rect x="${width * 0.05}" y="${height * 0.86}" width="${width * 0.9}" height="${height * 0.04}" rx="12" fill="${INK}" opacity="0.12"/>
    <rect x="${width * 0.06}" y="${height * 0.76}" width="${width * 0.06}" height="${height * 0.1}" rx="8" fill="#e8ded6"/>
    <path d="M${width * 0.09} ${height * 0.76} q-${width * 0.04} -${height * 0.1} 0 -${height * 0.17}
             q${width * 0.04} ${height * 0.07} 0 ${height * 0.17} Z" fill="#1f9d76"/>
  `,
  );

/** Square crop of the same illustration system, for testimonial avatars. */
const avatarPortrait = (palette, style, seed) =>
  portrait(280, 280, palette, style, seed);

/* -------------------------------------------------------------------------- */
/* run                                                                         */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log("Generating demo-centre assets…");

  /* branding */
  await writeText("branding/gemilang-logo-mark.svg", logoMark(40, 12).trim());
  await writeText("branding/gemilang-logo.svg", logoMark(40, 12).trim());
  await writeText("branding/favicon.svg", logoMark(32, 8).trim());

  const appleIcon = await sharp(Buffer.from(logoMark(180, 40)))
    .resize(180, 180)
    .png()
    .toBuffer();
  await mkdir(join(outDir, "branding"), { recursive: true });
  await writeFile(join(outDir, "branding/apple-icon.png"), appleIcon);
  console.log("  ✓ branding/apple-icon.png");

  /* favicon.ico (PNG payload wrapped in an ICO container) */
  const icoPng = await sharp(Buffer.from(logoMark(32, 6))).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count
  header.writeUInt8(32, 6); // width
  header.writeUInt8(32, 7); // height
  header.writeUInt8(0, 8); // palette size
  header.writeUInt8(0, 9); // reserved
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(icoPng.length, 14);
  header.writeUInt32LE(22, 18);
  await writeFile(join(root, "public/favicon.ico"), Buffer.concat([header, icoPng]));
  console.log("  ✓ /favicon.ico");

  /* subjects */
  const subjectAccents = {
    "additional-mathematics-graph": "#3f6fd8",
    "physics-atom": "#6b4fd8",
    "chemistry-flask": "#1f9d76",
    "english-open-book": "#d8843f",
    "sejarah-scroll": "#a2603a",
  };
  for (const [name, build] of Object.entries(subjectIllustrations)) {
    await writeWebp(`subjects/${name}.webp`, build(subjectAccents[name]), { quality: 90 });
  }

  /* tutors */
  const tutorSlugs = [
    "nurul-aisyah-rahim",
    "chen-wei-lun",
    "priya-devarajan",
    "daniel-jugah",
    "faridah-mohd-salleh",
  ];
  for (const [index, slug] of tutorSlugs.entries()) {
    await writeWebp(
      `tutors/tutor-${slug}.webp`,
      portrait(800, 1000, PORTRAIT_PALETTES[index % PORTRAIT_PALETTES.length], index, index),
    );
  }

  /* testimonial avatars */
  const avatars = [
    "parent-lim-siew-hoon",
    "student-arif-hakimi",
    "student-tan-mei-ling",
    "parent-hafiz-rahman",
    "student-nadia-sofea",
    "parent-jessica-anak-belaja",
  ];
  for (const [index, name] of avatars.entries()) {
    await writeWebp(
      `testimonials/${name}.webp`,
      avatarPortrait(
        PORTRAIT_PALETTES[(index + 2) % PORTRAIT_PALETTES.length],
        index + 1,
        index + 10,
      ),
      { quality: 90 },
    );
  }

  /* scenes */
  await writeWebp("hero/live-lesson-preview.webp", classroomScene(1200, 900, 0), {
    quality: 88,
  });
  await writeWebp("classrooms/small-group-classroom.webp", classroomScene(1200, 900, 1), {
    quality: 88,
  });
  await writeWebp("locations/kuching-central-branch.webp", branchScene(1200, 800, 0));
  await writeWebp("locations/kota-samarahan-branch.webp", branchScene(1200, 800, 1));

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
