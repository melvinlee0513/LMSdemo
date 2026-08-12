import type { CentreDefinition } from "@/config/types";

type TestimonialInput = NonNullable<CentreDefinition["testimonials"]>[number];

/**
 * DEMO DATA — these testimonials are written for this template demonstration.
 * They are not real quotes from real families.
 *
 * For a live centre: only publish testimonials the centre has actually
 * collected and has permission to use. Never generate them.
 */
export const testimonials: TestimonialInput[] = [
  {
    id: "parent-lim-siew-hoon",
    authorType: "parent",
    author: "Mrs Lim Siew Hoon",
    context: "Parent of a Form 5 student",
    quote:
      "What convinced me was the weekly feedback. I always knew exactly what my daughter had covered and what she was struggling with, instead of finding out after the exam. She went from avoiding Add Maths homework to asking for extra practice papers.",
    subject: "additional-mathematics",
    outcome: "Consistent improvement across Form 5",
    year: "2024",
    rating: 5,
    featured: true,
    avatar: {
      src: "/centres/demo-centre/testimonials/parent-lim-siew-hoon.webp",
      alt: "Illustrated avatar of parent Mrs Lim Siew Hoon",
      width: 280,
      height: 280,
    },
  },
  {
    id: "student-arif-hakimi",
    authorType: "student",
    author: "Arif Hakimi",
    context: "Form 5, SMK Batu Lintang",
    quote:
      "Physics stopped being about memorising formulas. Mr Chen shows you the actual thing happening first, then the equation makes sense. The Paper 3 workshops were the part school never really covered.",
    subject: "physics",
    outcome: "Moved up two grades in Physics",
    year: "2024",
    rating: 5,
    featured: true,
    avatar: {
      src: "/centres/demo-centre/testimonials/student-arif-hakimi.webp",
      alt: "Illustrated avatar of student Arif Hakimi",
      width: 280,
      height: 280,
    },
  },
  {
    id: "student-tan-mei-ling",
    authorType: "student",
    author: "Tan Mei Ling",
    context: "Form 4",
    quote:
      "I joined halfway through Form 4 thinking I was too far behind. The diagnostic showed my problem was actually algebra from Form 3, and once that was fixed the rest was much easier to follow.",
    subject: "additional-mathematics",
    year: "2025",
    rating: 5,
    avatar: {
      src: "/centres/demo-centre/testimonials/student-tan-mei-ling.webp",
      alt: "Illustrated avatar of student Tan Mei Ling",
      width: 280,
      height: 280,
    },
  },
  {
    id: "parent-hafiz-rahman",
    authorType: "parent",
    author: "Encik Hafiz Rahman",
    context: "Parent of a Form 4 student",
    quote:
      "The class size is genuinely small, which is the whole reason we chose this centre. My son cannot hide at the back, and the tutor notices immediately when he has not understood something.",
    subject: "chemistry",
    year: "2025",
    rating: 5,
    avatar: {
      src: "/centres/demo-centre/testimonials/parent-hafiz-rahman.webp",
      alt: "Illustrated avatar of parent Encik Hafiz Rahman",
      width: 280,
      height: 280,
    },
  },
  {
    id: "student-nadia-sofea",
    authorType: "student",
    author: "Nadia Sofea",
    context: "Form 5",
    quote:
      "Writing one essay every week sounded like a lot at first, but getting it back with real corrections is what actually changed my marks. I stopped repeating the same mistakes.",
    subject: "english",
    outcome: "Improved essay band in trials",
    year: "2024",
    rating: 5,
    avatar: {
      src: "/centres/demo-centre/testimonials/student-nadia-sofea.webp",
      alt: "Illustrated avatar of student Nadia Sofea",
      width: 280,
      height: 280,
    },
  },
  {
    id: "parent-jessica-anak-belaja",
    authorType: "parent",
    author: "Madam Jessica Anak Belaja",
    context: "Parent of a Form 5 student",
    quote:
      "We travel from Kota Samarahan and it has been worth it. The timetable is clear, the tutors reply on WhatsApp, and my daughter finally has a study routine that does not depend on me nagging her.",
    subject: "sejarah",
    year: "2025",
    rating: 4,
    avatar: {
      src: "/centres/demo-centre/testimonials/parent-jessica-anak-belaja.webp",
      alt: "Illustrated avatar of parent Madam Jessica Anak Belaja",
      width: 280,
      height: 280,
    },
  },
];
