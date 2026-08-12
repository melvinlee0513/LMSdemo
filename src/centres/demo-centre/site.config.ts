import type { CentreDefinition } from "@/config/types";

/**
 * ---------------------------------------------------------------------------
 * Gemilang Tuition Academy — FICTIONAL reference centre
 * ---------------------------------------------------------------------------
 * This centre does not exist. It is the reference implementation used to
 * demonstrate every route, component variant and feature flag in the engine.
 *
 * Deliberate placeholder markers, so nothing here can be mistaken for real
 * business information:
 *   • phone / WhatsApp numbers are all zeros
 *   • the email domain uses the reserved `.example` TLD
 *   • statistics, ratings and testimonials are written for the demo
 *
 * When you clone this file for a real centre, delete every value you have not
 * been given. An omitted field renders nothing; an invented one is a lie in
 * the centre's name.
 */
export const siteConfig = {
  id: "demo-centre",

  identity: {
    name: "Gemilang Tuition Academy",
    shortName: "Gemilang",
    legalName: "Gemilang Tuition Academy",
    tagline: "Small-group SPM tuition in Kuching",
    description:
      "Gemilang Tuition Academy runs small-group Form 3 to Form 5 tuition in Kuching and Kota Samarahan, covering Additional Mathematics, Physics, Chemistry, English and Sejarah with weekly marked practice and tutors who know every student by name.",
    logo: "/centres/demo-centre/branding/gemilang-logo.svg",
    logoMark: "/centres/demo-centre/branding/gemilang-logo-mark.svg",
    logoLockup: "mark-and-name",
    favicon: "/centres/demo-centre/branding/favicon.svg",
    appleIcon: "/centres/demo-centre/branding/apple-icon.png",
    establishedYear: 2016,
    city: "Kuching",
    state: "Sarawak",
    country: "Malaysia",
  },

  branding: {
    primary: "#ef4524",
    secondary: "#ff7a1f",
    soft: "#fff0ed",
    soft2: "#fff8f5",
    textPrimary: "#202632",
    textSecondary: "#687385",
    textMuted: "#8b93a1",
    surface: "#ffffff",
    surfaceWarm: "#fffdfb",
    surfaceMuted: "#fafafa",
    border: "#e7e9ee",
    borderWarm: "#f1ded8",
    footer: "#202632",
    font: "poppins",
    gradientAngle: 100,
  },

  seo: {
    titleTemplate: "%s | Gemilang Tuition Academy",
    defaultTitle: "Small-Group SPM Tuition in Kuching | Gemilang Tuition Academy",
    defaultDescription:
      "Small-group Form 3–5 tuition in Kuching and Kota Samarahan. Additional Mathematics, Physics, Chemistry, English and Sejarah, taught by named tutors with weekly marked practice. Book a trial class.",
    keywords: [
      "tuition Kuching",
      "SPM tuition",
      "Additional Mathematics tuition",
      "Physics tuition Kuching",
      "small group tuition Sarawak",
    ],
    locale: "en_MY",
    language: "en-MY",
    defaultOgImage: undefined,
    pages: {
      about: {
        description:
          "How Gemilang Tuition Academy teaches: small groups, named tutors, weekly marked practice and a diagnostic before any new syllabus content begins.",
      },
      contact: {
        description:
          "Contact Gemilang Tuition Academy in Kuching or Kota Samarahan by WhatsApp, phone or enquiry form. Branch addresses and class hours included.",
      },
    },
  },

  contact: {
    phone: "+60 00-0000 0000",
    whatsapp: "60000000000",
    email: "hello@gemilang-academy.example",
    hours: [
      { label: "Monday – Friday", value: "2:00 PM – 9:30 PM" },
      { label: "Saturday", value: "9:00 AM – 6:00 PM" },
      { label: "Sunday", value: "9:00 AM – 4:00 PM" },
    ],
    priority: ["whatsapp", "phone", "form", "email"],
  },

  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },

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
    cta: { label: "Book a Trial", href: "/trial" },
    mobileSecondaryCta: { label: "Register a Student", href: "/register" },
  },

  footer: {
    description:
      "Small-group tuition for Form 3 to Form 5 students in Kuching and Kota Samarahan. Named tutors, weekly marked practice and class sizes small enough that nobody gets left behind.",
    legalLinks: [{ label: "Privacy Notice", href: "/privacy" }],
    note: "Gemilang Tuition Academy is a fictional centre created to demonstrate this website engine.",
  },

  hero: {
    eyebrow: "Now enrolling for the new term",
    headline: [
      { text: "Understand it once.", break: true },
      { text: "Remember it" },
      { text: "for the exam.", highlight: true },
    ],
    description:
      "Small-group tuition for Form 3–5 students in Kuching. Every class is capped, every tutor is named, and every week your child leaves with marked work and one clear thing to improve.",
    primaryCta: { label: "Book a Free Trial Class", href: "/trial" },
    secondaryCta: { label: "See the Timetable", href: "/timetable" },
    trust: {
      rating: 4.9,
      ratingLabel: "Average tutor rating from our 2024 parent survey",
      text: "Trusted by families across Kuching & Kota Samarahan",
    },
    media: {
      image: {
        src: "/centres/demo-centre/hero/live-lesson-preview.webp",
        alt: "Illustration of a small-group tuition class in progress",
        width: 1200,
        height: 900,
      },
      preview: {
        label: "This week at Kuching Central",
        title: "Form 5 Physics — Waves & Interference",
        meta: ["Saturday, 10:00 AM", "2 hours", "Chen Wei Lun"],
      },
      badge: {
        icon: "users",
        title: "Max 12 students",
        subtitle: "in every class",
      },
      chip: {
        icon: "checkCircle",
        value: "Weekly",
        label: "marked practice",
      },
    },
  },

  // DEMO figures. For a real centre, only publish numbers the centre has
  // supplied and can stand behind.
  stats: [
    { icon: "graduationCap", value: "1,200+", label: "Students taught" },
    { icon: "calendarDays", value: "9", label: "Years teaching in Kuching" },
    { icon: "users", value: "12", label: "Students per class, maximum" },
    { icon: "bookOpen", value: "5", label: "Subjects offered" },
  ],

  methods: {
    eyebrow: "How we teach",
    heading: "A method that survives contact with a real exam",
    highlight: "a real exam",
    description:
      "Every subject at Gemilang runs on the same four-step cycle. It is unglamorous, it is repeated weekly, and it is the reason students stop relying on last-minute cramming.",
    items: [
      {
        icon: "clipboardCheck",
        title: "Diagnose before teaching",
        description:
          "New students sit a short diagnostic so we fix the gap that is actually costing marks, rather than starting wherever the school happens to be.",
      },
      {
        icon: "presentation",
        title: "Teach in small groups",
        description:
          "Classes are capped at twelve. Tutors can see who has understood and who is quietly lost, which is the entire point of tuition.",
      },
      {
        icon: "notebookPen",
        title: "Practise under time",
        description:
          "Every week ends with a timed set in past-year question style, marked against the official scheme so students learn how marks are awarded.",
      },
      {
        icon: "messageCircle",
        title: "Report back honestly",
        description:
          "Parents receive a short written update each month: what was covered, what improved, and the one thing we are working on next.",
      },
    ],
  },

  about: {
    eyebrow: "About the centre",
    heading: "Built by tutors who were tired of watching students fall behind",
    highlight: "fall behind",
    intro: [
      "Gemilang Tuition Academy began in 2016 with one classroom, two tutors and a simple observation: most students who struggle at SPM are not lazy and are not incapable. They are carrying a gap from two years earlier that nobody had time to find.",
      "So we built the centre around finding it. Every student sits a diagnostic before their first proper lesson. Classes are capped at twelve so tutors can actually see who is lost. Work is marked weekly rather than collected and forgotten, and parents get a written update every month instead of a phone call after the results are already out.",
      "Today we teach five subjects across two branches in Kuching and Kota Samarahan, and we still run the centre the same way: named tutors, small rooms, and honest reporting even when the news is not good.",
    ],
    mission: {
      title: "Our mission",
      body: "To make sure that no student in our classes is quietly falling behind — by keeping groups small, marking work every week, and telling parents the truth early enough to act on it.",
    },
    values: [
      {
        icon: "target",
        title: "Result-oriented",
        description:
          "We measure progress with marked work and timed practice, not with how busy a student looks.",
      },
      {
        icon: "userCheck",
        title: "Student-centred",
        description:
          "Class sizes stay small because attention is the thing families are actually paying for.",
      },
      {
        icon: "lightbulb",
        title: "Understanding first",
        description:
          "We teach the idea before the formula. Memorising is what students do after they understand, not instead of it.",
      },
      {
        icon: "handshake",
        title: "Honest with parents",
        description:
          "Monthly written updates, including the parts that are not going well. Surprises belong in birthdays, not in report cards.",
      },
    ],
    history: [
      {
        year: "2016",
        title: "One classroom in Kuching",
        description:
          "The centre opens with two tutors teaching Additional Mathematics and Physics to twenty-eight students.",
      },
      {
        year: "2019",
        title: "The diagnostic programme",
        description:
          "Entry diagnostics become standard for every subject after they consistently explain why students plateau.",
      },
      {
        year: "2023",
        title: "Kota Samarahan opens",
        description:
          "A second branch opens for families who had been travelling into Kuching for weekday classes.",
      },
    ],
    image: {
      src: "/centres/demo-centre/classrooms/small-group-classroom.webp",
      alt: "Illustration of a small tuition classroom with a whiteboard and desks",
      width: 1200,
      height: 900,
    },
  },

  trialCta: {
    eyebrow: "Try before you commit",
    heading: "Sit in on a real class before you enrol",
    highlight: "a real class",
    description:
      "Trial students join a normal session, do the same work and receive the same marked feedback. No sales pitch, no obligation to continue.",
    bullets: [
      "One free trial session per subject",
      "Join an existing class, not a demo lesson",
      "Written feedback afterwards either way",
    ],
    primaryCta: { label: "Book a Trial Class", href: "/trial" },
    secondaryLabel: "Questions first?",
    whatsapp: true,
  },

  finalCta: {
    eyebrow: "Ready when you are",
    heading: "Let's find the right class for your child",
    highlight: "the right class",
    description:
      "Tell us the subject and form, and we will suggest the class that fits — or tell you honestly if we are not the right centre for what you need.",
    bullets: [
      "Free trial class available",
      "Named tutors for every subject",
      "Two branches plus online classes",
    ],
    primaryCta: { label: "Register a Student", href: "/register" },
    secondaryLabel: "Prefer to ask first?",
    whatsapp: true,
  },

  featureFlags: {
    about: true,
    subjects: true,
    subjectDetailPages: true,
    classes: true,
    classDetailPages: true,
    tutors: true,
    timetable: true,
    testimonials: true,
    locations: true,
    locationDetailPages: true,
    trialRegistration: true,
    studentRegistration: true,
    enquiryForm: true,
    parentLeadCapture: true,
    whatsapp: true,
  },

  componentVariants: {
    hero: "split-preview",
    subjects: "split-cards",
    tutors: "portrait-card",
    testimonials: "featured-and-grid",
    methods: "cards",
    stats: "cards",
    cta: "boxed",
  },

  homepageSections: [
    "hero",
    "stats",
    "subjects",
    "methods",
    "classes",
    "tutors",
    "timetable",
    "testimonials",
    "locations",
    "trialCta",
    "finalCta",
  ],

  forms: {
    provider: "none",
    privacyNotice:
      "We use the details you provide only to contact you about classes at Gemilang Tuition Academy. We do not sell or share them with anyone else.",
    consentLabel:
      "I agree to be contacted about classes and trial sessions using the details above.",
    successTitle: "Thank you — we have your details",
    successBody:
      "A member of the team will reply on WhatsApp within one working day to confirm the class and answer any questions.",
  },

  whatsapp: {
    number: "60000000000",
    displayNumber: "+60 00-0000 0000",
    floatingButton: true,
    mobileStickyBar: true,
    templates: {
      general: "Hi {{centre}}, I would like to ask about your tuition classes.",
      subject:
        "Hi {{centre}}, I am interested in your {{subject}} classes. Could you tell me more?",
      class:
        "Hi {{centre}}, I am interested in the {{class}} class. Is there still a place available?",
      tutor:
        "Hi {{centre}}, I would like to ask about classes taught by {{tutor}}.",
      trial:
        "Hi {{centre}}, I would like to book a trial class for {{subject}}.",
      location:
        "Hi {{centre}}, I would like to ask about classes at your {{branch}} branch.",
    },
  },

  privacy: {
    updated: "January 2025",
    intro:
      "This notice explains what personal information Gemilang Tuition Academy collects through this website, why we collect it, and what we do with it. It is written to be readable rather than exhaustive — if anything is unclear, please ask us.",
    sections: [
      {
        title: "What we collect",
        body: [
          "When you complete an enquiry, trial booking or registration form we collect the details you type into that form: typically a student name, school year, the subjects you are interested in, a parent or guardian name, and a contact number or email address.",
          "We do not ask for identity card numbers, payment details or any information about health or background through this website.",
        ],
      },
      {
        title: "Why we collect it",
        body: [
          "We use these details for one purpose: to contact you about classes at our centre and to arrange a trial or enrolment. We do not sell your details, and we do not pass them to third parties for marketing.",
        ],
      },
      {
        title: "How long we keep it",
        body: [
          "Enquiry details are kept while we are in conversation with you and for a reasonable period afterwards in case you return. If you ask us to delete your details, we will do so.",
        ],
      },
      {
        title: "Cookies and analytics",
        body: [
          "This website does not use advertising cookies. If analytics are enabled, they record anonymous page usage only. The contents of form fields are never sent to any analytics service.",
        ],
      },
      {
        title: "Contacting us about your details",
        body: [
          "To ask what we hold, to correct something, or to have your details removed, contact us using any of the channels on our contact page and we will respond as quickly as we can.",
        ],
      },
    ],
  },
} satisfies Partial<CentreDefinition>;
