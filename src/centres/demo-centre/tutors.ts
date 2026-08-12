import type { CentreDefinition } from "@/config/types";

type TutorInput = NonNullable<CentreDefinition["tutors"]>[number];

/**
 * DEMO DATA — every tutor below is fictional and exists only to demonstrate
 * the tutor components. For a real centre, never populate `yearsExperience`,
 * `studentsTaught`, `rating` or `qualifications` unless the centre has
 * supplied and verified those figures. Omit the field instead.
 */
export const tutors: TutorInput[] = [
  {
    slug: "nurul-aisyah-rahim",
    name: "Nurul Aisyah Rahim",
    role: "Head of Mathematics",
    subjects: ["additional-mathematics"],
    image: {
      src: "/centres/demo-centre/tutors/tutor-nurul-aisyah-rahim.webp",
      alt: "Illustrated portrait of Add Maths tutor Nurul Aisyah Rahim",
      width: 800,
      height: 1000,
    },
    bio: "Aisyah teaches Additional Mathematics the way she wishes it had been taught to her — slowly at the foundations, then quickly once the algebra is automatic. She leads the centre's Form 4 diagnostic programme and writes the weekly timed practice sets.",
    expertise: [
      "Functions & quadratics",
      "Differentiation",
      "Integration",
      "Exam technique",
    ],
    yearsExperience: 12,
    studentsTaught: 480,
    rating: 4.9,
    qualifications: [
      "BSc (Hons) Mathematics",
      "Postgraduate Diploma in Education",
    ],
    locations: ["kuching-central"],
    featured: true,
  },
  {
    slug: "chen-wei-lun",
    name: "Chen Wei Lun",
    role: "Senior Physics Tutor",
    subjects: ["physics", "additional-mathematics"],
    image: {
      src: "/centres/demo-centre/tutors/tutor-chen-wei-lun.webp",
      alt: "Illustrated portrait of Physics tutor Chen Wei Lun",
      width: 800,
      height: 1000,
    },
    bio: "Wei Lun spent six years as an engineer before returning to teaching, and it shows: every topic starts with something students can picture. He runs the centre's Paper 3 experiment workshops.",
    expertise: ["Forces & motion", "Electricity", "Waves", "Paper 3 practicals"],
    yearsExperience: 9,
    studentsTaught: 320,
    rating: 4.8,
    qualifications: ["BEng (Hons) Mechanical Engineering"],
    locations: ["kuching-central"],
    featured: true,
  },
  {
    slug: "priya-devarajan",
    name: "Priya Devarajan",
    role: "Chemistry Tutor",
    subjects: ["chemistry", "physics"],
    image: {
      src: "/centres/demo-centre/tutors/tutor-priya-devarajan.webp",
      alt: "Illustrated portrait of Chemistry tutor Priya Devarajan",
      width: 800,
      height: 1000,
    },
    bio: "Priya is known for making the mole concept click. She builds each Chemistry topic around a visual model first, then drills the calculation until students stop second-guessing themselves.",
    expertise: ["Mole concept", "Bonding", "Acids & bases", "Organic chemistry"],
    yearsExperience: 8,
    studentsTaught: 260,
    rating: 4.9,
    qualifications: ["BSc (Hons) Chemistry"],
    locations: ["kuching-central", "kota-samarahan"],
    featured: true,
  },
  {
    slug: "daniel-jugah",
    name: "Daniel Jugah",
    role: "English Language Tutor",
    subjects: ["english"],
    image: {
      src: "/centres/demo-centre/tutors/tutor-daniel-jugah.webp",
      alt: "Illustrated portrait of English tutor Daniel Jugah",
      width: 800,
      height: 1000,
    },
    bio: "Daniel marks every piece of writing his students submit and gives each of them a single target for the following week. His classes are conversation-heavy by design — nobody sits quietly at the back.",
    expertise: [
      "Essay writing",
      "Comprehension",
      "Speaking assessment",
      "Grammar repair",
    ],
    yearsExperience: 11,
    studentsTaught: 410,
    rating: 4.8,
    qualifications: ["BA (Hons) English Language & Literature", "CELTA"],
    locations: ["kuching-central", "kota-samarahan"],
    featured: true,
  },
  {
    slug: "faridah-mohd-salleh",
    name: "Faridah Mohd Salleh",
    role: "Sejarah Tutor",
    subjects: ["sejarah", "english"],
    image: {
      src: "/centres/demo-centre/tutors/tutor-faridah-mohd-salleh.webp",
      alt: "Illustrated portrait of Sejarah tutor Faridah Mohd Salleh",
      width: 800,
      height: 1000,
    },
    bio: "Faridah replaces rote memorising with structure: timelines, cause-and-effect maps and a disciplined method for KBAT answers. Students who once dreaded Sejarah tend to leave her class with a plan.",
    expertise: ["Timeline mapping", "KBAT answers", "Essay structure"],
    yearsExperience: 14,
    studentsTaught: 520,
    rating: 4.7,
    qualifications: ["BA (Hons) History", "Diploma in Education"],
    locations: ["kota-samarahan"],
  },
];
