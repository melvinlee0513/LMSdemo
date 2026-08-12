import type { CentreDefinition } from "@/config/types";

type SubjectInput = NonNullable<CentreDefinition["subjects"]>[number];

/**
 * DEMO DATA — Gemilang Tuition Academy is a fictional centre.
 * All copy below is written specifically for this template demonstration.
 *
 * `seoIndexable` is only true where a subject carries genuinely unique
 * `detail` content. Subjects without it still get a useful page for humans,
 * but that page is marked noindex and excluded from the sitemap.
 */
export const subjects: SubjectInput[] = [
  {
    slug: "additional-mathematics",
    name: "Additional Mathematics",
    shortName: "Add Maths",
    category: "mathematics",
    icon: "sigma",
    accent: "#3f6fd8",
    featured: true,
    summary:
      "Build the algebraic fluency and problem-solving habits that make Add Maths feel predictable instead of frightening — from functions to calculus.",
    levels: ["Form 4", "Form 5"],
    image: {
      src: "/centres/demo-centre/subjects/additional-mathematics-graph.webp",
      alt: "Illustration of a quadratic curve plotted on a coordinate grid",
      width: 960,
      height: 720,
    },
    seoIndexable: true,
    detail: {
      intro:
        "Additional Mathematics is the subject most Form 4 students underestimate. The syllabus moves quickly from functions and quadratics into indices, logarithms, coordinate geometry, trigonometry, differentiation and integration — and each topic assumes the previous one is already automatic. Our Add Maths classes are built around that dependency chain. Students spend the first weeks rebuilding algebraic manipulation until it is genuinely fast, then work forward topic by topic with weekly timed practice so that examination pressure never meets an unfamiliar question type.",
      outcomes: [
        "Manipulate algebraic expressions, indices and logarithms without hesitation",
        "Read a question and identify which technique the examiner is testing",
        "Sketch and interpret quadratic, trigonometric and exponential graphs",
        "Apply differentiation and integration to rates, areas and kinematics problems",
        "Structure written solutions so that method marks are never lost",
      ],
      approach: [
        {
          title: "Diagnostic first, syllabus second",
          description:
            "Every new student sits a short algebra diagnostic. We fix the gaps that actually cause lost marks before moving into new Form 4 content.",
        },
        {
          title: "Worked example, then guided attempt",
          description:
            "Each concept is demonstrated once in full, attempted with support, then attempted alone under time. Understanding is checked before the class moves on.",
        },
        {
          title: "Weekly timed sets",
          description:
            "Students complete a short timed paper each week using past-year question styles, marked against the official marking scheme so they learn how marks are awarded.",
        },
      ],
      faqs: [
        {
          question: "My child is already struggling in Form 4. Is it too late?",
          answer:
            "No. Most students who join mid-Form 4 are missing algebra fundamentals rather than Add Maths content. We diagnose that first, which usually makes the rest of the syllabus far more manageable.",
        },
        {
          question: "Do you follow the school's pace?",
          answer:
            "We follow the SPM syllabus order, which most schools also follow. Where a student's school is ahead or behind, tutors adjust the weekly practice set rather than the whole class.",
        },
      ],
    },
  },
  {
    slug: "physics",
    name: "Physics",
    category: "science",
    icon: "atom",
    accent: "#6b4fd8",
    featured: true,
    summary:
      "Turn formula-memorising into real understanding with experiment-led explanations, structured problem solving and plenty of past-year practice.",
    levels: ["Form 4", "Form 5"],
    image: {
      src: "/centres/demo-centre/subjects/physics-atom.webp",
      alt: "Illustration of an atom with orbiting electrons",
      width: 960,
      height: 720,
    },
    seoIndexable: true,
    detail: {
      intro:
        "SPM Physics rewards students who can explain, not just calculate. Paper 2 and Paper 3 questions ask candidates to describe what happens, justify why, and design or criticise an experiment. Our Physics classes therefore split every topic into three passes: the physical idea explained with a demonstration or simulation, the mathematics that describes it, and the examination language used to express it. Students leave each topic with a one-page concept summary in their own words, which becomes their revision material later in Form 5.",
      outcomes: [
        "Explain physical phenomena in the precise language SPM examiners expect",
        "Select and rearrange the right formula under time pressure",
        "Interpret graphs, gradients and areas correctly in motion and electricity questions",
        "Plan a fair experiment with correct variables, apparatus and precautions",
        "Answer Paper 3 structured questions using the full marking framework",
      ],
      approach: [
        {
          title: "Concept before calculation",
          description:
            "Each topic opens with a demonstration or simulation so students can picture what the equation describes before they use it.",
        },
        {
          title: "Answer-language drills",
          description:
            "Students practise writing explanation answers to the marking scheme, because most lost Physics marks are lost in wording rather than in physics.",
        },
        {
          title: "Paper 3 workshops",
          description:
            "Dedicated sessions on experiment design, tabulation, graph plotting and error discussion, which many students never practise properly at school.",
        },
      ],
    },
  },
  {
    slug: "chemistry",
    name: "Chemistry",
    category: "science",
    icon: "flaskConical",
    accent: "#1f9d76",
    summary:
      "Master the mole, bonding and organic chemistry through clear visual models, structured calculation practice and disciplined answer writing.",
    levels: ["Form 4", "Form 5"],
    image: {
      src: "/centres/demo-centre/subjects/chemistry-flask.webp",
      alt: "Illustration of a conical flask with rising bubbles",
      width: 960,
      height: 720,
    },
  },
  {
    slug: "english",
    name: "English",
    category: "languages",
    icon: "bookOpen",
    featured: true,
    accent: "#d8843f",
    summary:
      "Grow real confidence in writing and speaking, with structured essay frameworks, weekly marked writing and small-group discussion practice.",
    levels: ["Form 3", "Form 4", "Form 5"],
    image: {
      src: "/centres/demo-centre/subjects/english-open-book.webp",
      alt: "Illustration of an open book with flowing pages",
      width: 960,
      height: 720,
    },
    seoIndexable: true,
    detail: {
      intro:
        "English is the subject where marks are won by habit rather than by cramming. Our classes are built around weekly written work that is actually marked and returned with specific corrections, plus structured speaking practice in groups small enough that every student speaks in every session. Students work through the SPM writing formats — informal and formal letters, articles, reports, narrative and argumentative essays — until the structure is automatic and their attention can go to content and expression instead.",
      outcomes: [
        "Plan and write each SPM essay format inside the real time limit",
        "Use a wider, more precise vocabulary without sounding forced",
        "Correct the grammar errors that repeatedly cost marks in their own writing",
        "Read comprehension passages strategically and answer in their own words",
        "Speak with structure and confidence in the speaking assessment",
      ],
      approach: [
        {
          title: "Write weekly, marked properly",
          description:
            "Every student submits one piece of writing each week. It comes back with specific corrections and a single improvement target for the following week.",
        },
        {
          title: "Frameworks, not templates",
          description:
            "Students learn a reusable structure for each format so they never face a blank page, while the content stays genuinely their own.",
        },
        {
          title: "Everyone speaks, every session",
          description:
            "Group sizes are kept small enough that every student takes part in discussion practice rather than watching from the back.",
        },
      ],
      faqs: [
        {
          question: "Is the class conducted fully in English?",
          answer:
            "Yes, with support. Tutors will clarify in Bahasa Melayu when a student is genuinely stuck, but the working language of the class is English so that students build fluency.",
        },
      ],
    },
  },
  {
    slug: "sejarah",
    name: "Sejarah",
    shortName: "Sejarah",
    category: "humanities",
    icon: "scrollText",
    accent: "#a2603a",
    summary:
      "Replace rote memorising with structured recall — timelines, cause-and-effect mapping and disciplined KBAT answer practice.",
    levels: ["Form 4", "Form 5"],
    image: {
      src: "/centres/demo-centre/subjects/sejarah-scroll.webp",
      alt: "Illustration of an unrolled historical scroll beside a classical column",
      width: 960,
      height: 720,
    },
  },
];
