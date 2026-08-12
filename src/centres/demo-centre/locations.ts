import type { CentreDefinition } from "@/config/types";

type LocationInput = NonNullable<CentreDefinition["locations"]>[number];

/**
 * DEMO DATA — fictional branches for a fictional centre.
 *
 * The addresses, phone numbers, opening hours and coordinates below are
 * deliberate placeholders (note the all-zero phone numbers and the .example
 * email domain). For a real centre, never invent any of these fields: leave
 * them out until the centre supplies them, because they feed the visible NAP
 * block and LocalBusiness structured data.
 */
export const locations: LocationInput[] = [
  {
    slug: "kuching-central",
    name: "Kuching Central",
    addressLines: ["Lot 88, Jalan Contoh Satu", "Taman Demonstrasi"],
    city: "Kuching",
    state: "Sarawak",
    postcode: "93150",
    phone: "+60 00-0000 0000",
    whatsapp: "60000000000",
    email: "kuching@gemilang-academy.example",
    isPrimary: true,
    // Placeholder coordinates for a fictional address — approximate Kuching
    // city centre. Replace with surveyed values for a real branch.
    latitude: 1.5533,
    longitude: 110.3592,
    hours: [
      {
        label: "Monday – Friday",
        value: "2:00 PM – 9:30 PM",
        days: ["mon", "tue", "wed", "thu", "fri"],
        opens: "14:00",
        closes: "21:30",
      },
      {
        label: "Saturday – Sunday",
        value: "9:00 AM – 6:00 PM",
        days: ["sat", "sun"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    subjects: [
      "additional-mathematics",
      "physics",
      "chemistry",
      "english",
      "sejarah",
    ],
    image: {
      src: "/centres/demo-centre/locations/kuching-central-branch.webp",
      alt: "Illustration of the Kuching Central branch shopfront",
      width: 1200,
      height: 800,
    },
    seoIndexable: true,
    intro:
      "Kuching Central is our main branch and the base for the Mathematics and Physics programmes. It has six classrooms, a quiet self-study room that students may use before and after their sessions, and a small parent waiting area. Most students arrive directly after school, so the branch opens from two in the afternoon on weekdays and runs weekend intensive sessions for Form 5 during the SPM term.",
    gettingHere: [
      "Roughly ten minutes by car from the city centre, with street parking along the service road",
      "Served by the main bus route; the nearest stop is a two-minute walk",
      "A supervised waiting area is available for students collected after evening classes",
    ],
  },
  {
    slug: "kota-samarahan",
    name: "Kota Samarahan",
    addressLines: ["1st Floor, Blok C, Jalan Contoh Dua"],
    city: "Kota Samarahan",
    state: "Sarawak",
    postcode: "94300",
    phone: "+60 00-0000 0000",
    whatsapp: "60000000000",
    email: "samarahan@gemilang-academy.example",
    // Placeholder coordinates for a fictional address — approximate
    // Kota Samarahan town area.
    latitude: 1.4585,
    longitude: 110.4576,
    hours: [
      {
        label: "Monday – Friday",
        value: "3:00 PM – 9:00 PM",
        days: ["mon", "tue", "wed", "thu", "fri"],
        opens: "15:00",
        closes: "21:00",
      },
      {
        label: "Sunday",
        value: "9:00 AM – 1:00 PM",
        days: ["sun"],
        opens: "09:00",
        closes: "13:00",
      },
      { label: "Saturday", value: "Closed" },
    ],
    subjects: ["chemistry", "english", "sejarah"],
    image: {
      src: "/centres/demo-centre/locations/kota-samarahan-branch.webp",
      alt: "Illustration of the Kota Samarahan branch entrance",
      width: 1200,
      height: 800,
    },
    seoIndexable: true,
    intro:
      "The Kota Samarahan branch opened for families who were travelling into Kuching for weekday classes. It runs three classrooms and focuses on Chemistry, English and Sejarah, with Sunday morning sessions timed so that students living further out only need to make one trip each weekend. Students enrolled here may attend any Kuching Central session at no extra charge when a topic revision workshop is scheduled.",
    gettingHere: [
      "A short drive from the main campus area, with parking available at the rear of the block",
      "Sunday sessions are scheduled in the morning so families can make a single trip",
    ],
  },
];
