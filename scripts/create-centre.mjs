#!/usr/bin/env node
/**
 * ---------------------------------------------------------------------------
 * Centre scaffolder
 * ---------------------------------------------------------------------------
 *   npm run create-centre -- <slug> "Centre Name"
 *
 * Creates:
 *   src/centres/<slug>/       configuration + content files
 *   public/centres/<slug>/    asset folders
 * and registers the centre in src/centres/index.ts.
 *
 * The generated configuration is deliberately EMPTY of claims: no statistics,
 * no testimonials, no tutors, no opening hours. Content feature flags start
 * `false` so the new site builds and validates from the first minute, and each
 * one is switched on as real, supplied content arrives.
 *
 * This is a convenience, not a product. Everything it writes is ordinary
 * TypeScript you are meant to edit.
 */

import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const [slugArg, ...nameParts] = process.argv.slice(2);
const slug = slugArg?.trim();
const name = nameParts.join(" ").trim();

if (!slug || !name) {
  console.error(
    'Usage: npm run create-centre -- <slug> "Centre Name"\n' +
      'Example: npm run create-centre -- bintang-academy "Bintang Learning Academy"',
  );
  process.exit(1);
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    `"${slug}" is not a valid centre id. Use lowercase words separated by hyphens.`,
  );
  process.exit(1);
}

const centreDir = join(root, "src/centres", slug);
const assetDir = join(root, "public/centres", slug);

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

if (await exists(centreDir)) {
  console.error(`src/centres/${slug} already exists. Nothing was written.`);
  process.exit(1);
}

const camel = slug.replace(/-([a-z0-9])/g, (_m, c) => c.toUpperCase());

/* -------------------------------------------------------------------------- */

const siteConfig = `import type { CentreDefinition } from "@/config/types";

/**
 * ${name}
 *
 * Fill this in from information the centre has actually supplied.
 * Anything you have not been given, LEAVE OUT — an omitted field renders
 * nothing, while an invented one is a false claim published in the centre's
 * name. That applies especially to statistics, ratings, opening hours,
 * qualifications and student numbers.
 */
export const siteConfig = {
  id: "${slug}",

  identity: {
    name: "${name}",
    // shortName: "",
    // legalName: "",
    // tagline: "",
    description:
      "TODO: two sentences describing who this centre teaches, which subjects, and where. This feeds metadata and structured data, so write it for a human.",
    logo: "/centres/${slug}/branding/logo.svg",
    // logoMark: "/centres/${slug}/branding/logo-mark.svg",
    // logoLockup: "mark-and-name",
    favicon: "/centres/${slug}/branding/favicon.svg",
    // establishedYear: 2015,
    // city: "",
    // state: "",
    country: "Malaysia",
  },

  // Only primary and secondary are required; the rest of the palette has
  // sensible defaults. Nothing else in the codebase needs to change to
  // re-theme a centre.
  branding: {
    primary: "#ef4524",
    secondary: "#ff7a1f",
  },

  seo: {
    titleTemplate: "%s | ${name}",
    defaultTitle: "TODO: primary positioning | ${name}",
    defaultDescription:
      "TODO: a search-result description of roughly 150 characters covering what the centre teaches, who it serves and where.",
    locale: "en_MY",
    language: "en-MY",
  },

  contact: {
    // phone: "",
    // email: "",
    // Add "whatsapp" back to this list once featureFlags.whatsapp is true.
    priority: ["form", "email"],
  },

  social: {},

  navigation: {
    primary: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about", flag: "about" },
      { label: "Subjects", href: "/subjects", flag: "subjects" },
      { label: "Classes", href: "/classes", flag: "classes" },
      { label: "Tutors", href: "/tutors", flag: "tutors" },
      { label: "Timetable", href: "/timetable", flag: "timetable" },
      { label: "Locations", href: "/locations", flag: "locations" },
    ],
    // cta: { label: "Book a Trial", href: "/trial" },
  },

  footer: {
    description:
      "TODO: one or two sentences about the centre for the footer.",
    legalLinks: [{ label: "Privacy Notice", href: "/privacy" }],
  },

  hero: {
    // eyebrow: "",
    headline: [
      { text: "TODO: a headline", break: true },
      { text: "with one highlighted", highlight: true },
      { text: "fragment." },
    ],
    description:
      "TODO: two sentences that tell a parent what this centre offers and why it is different.",
    primaryCta: { label: "Contact the centre", href: "/contact" },
    // secondaryCta: { label: "See the Timetable", href: "/timetable" },
    media: {
      image: {
        src: "/centres/${slug}/hero/hero.webp",
        alt: "TODO: describe this image for someone who cannot see it",
        width: 1200,
        height: 900,
      },
    },
  },

  // Statistics are published claims. Add entries only for figures the centre
  // has supplied and can stand behind; an empty array hides the section.
  stats: [],

  methods: {
    eyebrow: "How we teach",
    heading: "TODO: the centre's teaching method in one line",
    description: "TODO: a sentence introducing the steps below.",
    items: [
      {
        icon: "clipboardCheck",
        title: "TODO: step one",
        description: "TODO: what happens at this step and why it matters.",
      },
      {
        icon: "presentation",
        title: "TODO: step two",
        description: "TODO: what happens at this step and why it matters.",
      },
    ],
  },

  finalCta: {
    eyebrow: "Get in touch",
    heading: "TODO: a closing invitation",
    description: "TODO: one sentence on what happens after they get in touch.",
    primaryCta: { label: "Contact the centre", href: "/contact" },
    whatsapp: false,
  },

  /**
   * Content flags start false. Switch each on once the matching file in this
   * folder holds real content — the build will tell you if you switch one on
   * too early.
   */
  featureFlags: {
    about: false,
    subjects: false,
    subjectDetailPages: false,
    classes: false,
    classDetailPages: false,
    tutors: false,
    timetable: false,
    testimonials: false,
    locations: false,
    locationDetailPages: false,
    trialRegistration: false,
    studentRegistration: false,
    enquiryForm: true,
    parentLeadCapture: false,
    whatsapp: false,
  },

  componentVariants: {
    hero: "split-photo",
    subjects: "split-cards",
    tutors: "portrait-card",
    testimonials: "featured-and-grid",
    methods: "cards",
    stats: "cards",
    cta: "boxed",
  },

  // Add sections here as their feature flags are enabled. Order is the page.
  homepageSections: ["hero", "methods", "finalCta"],

  forms: {
    provider: "none",
    privacyNotice:
      "TODO: one sentence stating what the centre does with the details submitted through this form.",
    successBody:
      "TODO: what the visitor should expect next, and how quickly.",
  },

  // Uncomment once the centre has supplied a WhatsApp number, then set
  // featureFlags.whatsapp to true and add "whatsapp" to contact.priority.
  // whatsapp: {
  //   number: "60XXXXXXXXX",
  //   displayNumber: "+60 XX-XXX XXXX",
  //   templates: {
  //     general: "Hi {{centre}}, I would like to ask about your classes.",
  //     subject: "Hi {{centre}}, I am interested in your {{subject}} classes.",
  //     class: "Hi {{centre}}, is there still a place in the {{class}} class?",
  //     tutor: "Hi {{centre}}, I would like to ask about classes taught by {{tutor}}.",
  //     trial: "Hi {{centre}}, I would like to book a trial class for {{subject}}.",
  //     location: "Hi {{centre}}, I would like to ask about your {{branch}} branch.",
  //   },
  // },

  privacy: {
    updated: "TODO: Month Year",
    intro:
      "TODO: a short introduction explaining what this notice covers and inviting questions.",
    sections: [
      {
        title: "What we collect",
        body: ["TODO: the details collected through the forms on this site."],
      },
      {
        title: "Why we collect it",
        body: ["TODO: what those details are used for, and what they are not used for."],
      },
      {
        title: "Contacting us about your details",
        body: ["TODO: how someone asks for their details to be corrected or removed."],
      },
    ],
  },
} satisfies Partial<CentreDefinition>;
`;

const collection = (kind, plural, note) => `import type { CentreDefinition } from "@/config/types";

type ${kind}Input = NonNullable<CentreDefinition["${plural}"]>[number];

/**
 * ${note}
 *
 * Add entries here, then set featureFlags.${plural} to true in site.config.ts.
 */
export const ${plural}: ${kind}Input[] = [];
`;

const indexFile = `import type { CentreDefinition } from "@/config/types";

import { classes } from "./classes";
import { locations } from "./locations";
import { siteConfig } from "./site.config";
import { subjects } from "./subjects";
import { testimonials } from "./testimonials";
import { tutors } from "./tutors";

const ${camel}: CentreDefinition = {
  ...siteConfig,
  subjects,
  classes,
  tutors,
  testimonials,
  locations,
};

export default ${camel};
`;

/* -------------------------------------------------------------------------- */

await mkdir(centreDir, { recursive: true });

const files = {
  "site.config.ts": siteConfig,
  "index.ts": indexFile,
  "subjects.ts": collection(
    "Subject",
    "subjects",
    "Academic areas this centre teaches.",
  ),
  "classes.ts": collection(
    "Class",
    "classes",
    "Bookable weekly sessions. A class is a subject at a level, with a tutor, day, time and place.",
  ),
  "tutors.ts": collection(
    "Tutor",
    "tutors",
    "Only publish experience, student counts, ratings and qualifications the centre has verified.",
  ),
  "testimonials.ts": collection(
    "Testimonial",
    "testimonials",
    "Only real quotes the centre has collected and has permission to publish.",
  ),
  "locations.ts": collection(
    "Location",
    "locations",
    "Branch addresses, hours and coordinates exactly as supplied — never estimated.",
  ),
};

for (const [file, contents] of Object.entries(files)) {
  await writeFile(join(centreDir, file), contents, "utf8");
}

const assetFolders = [
  "branding",
  "hero",
  "subjects",
  "tutors",
  "classrooms",
  "testimonials",
  "locations",
];

for (const folder of assetFolders) {
  await mkdir(join(assetDir, folder), { recursive: true });
  await writeFile(
    join(assetDir, folder, ".gitkeep"),
    `# ${folder} assets for ${name}\n# One semantic object, one semantic file — e.g. physics-atom.webp\n`,
    "utf8",
  );
}

/* Register the centre. */
const registryPath = join(root, "src/centres/index.ts");
let registry = await readFile(registryPath, "utf8");

registry = registry.replace(
  /(\/\* CENTRE IMPORTS[^\n]*\n)/,
  `$1import ${camel} from "./${slug}";\n`,
);
registry = registry.replace(
  /(\/\* CENTRE REGISTRY[^\n]*\n)/,
  `$1  "${slug}": ${camel},\n`,
);

await writeFile(registryPath, registry, "utf8");

console.log(`
Created ${name}

  src/centres/${slug}/       configuration and content
  public/centres/${slug}/    assets
  src/centres/index.ts       registered

Next:
  1. Work through the TODOs in src/centres/${slug}/site.config.ts
  2. Add content to subjects.ts / classes.ts / tutors.ts / locations.ts,
     switching on each feature flag as its content lands
  3. Drop assets into public/centres/${slug}/ using semantic file names
  4. Run it:   SITE_ID=${slug} npm run dev
  5. Check it: npm run typecheck && npm run build

Deploy it as its own Vercel project with SITE_ID=${slug}.
Keep SITE_MODE=demo until the centre has approved going live.
`);
